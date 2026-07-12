import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory, ProductStatus } from './enums/product-status.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: any) {
    const name = dto.name.trim();

    const existed = await this.productRepo.findOne({ where: { name } });
    if (existed) throw new BadRequestException('Sản phẩm đã tồn tại');

    const product = await this.productRepo.save({
      name,
      category: dto.category,
      price: dto.price,
      stock: dto.stock ?? 0,
      image_url: dto.image_url ?? null,
      status: dto.status ?? ProductStatus.ACTIVE,
    });

    return {
      success: true,
      data: {
        message: 'Tạo sản phẩm thành công',
        product,
      },
    };
  }

  async update(id: string, dto: any) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    Object.assign(product, {
      name: dto.name?.trim() ?? product.name,
      category: dto.category ?? product.category,
      price: dto.price ?? product.price,
      stock: dto.stock ?? product.stock,
      image_url: dto.image_url ?? product.image_url,
      status: dto.status ?? product.status,
    });

    await this.productRepo.save(product);

    return {
      success: true,
      data: {
        message: 'Cập nhật sản phẩm thành công',
        product,
      },
    };
  }

  async delete(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    product.status = ProductStatus.INACTIVE;
    await this.productRepo.save(product);

    return {
      success: true,
      data: {
        message: 'Xóa mềm sản phẩm thành công',
        product,
      },
    };
  }

  async findAll(query: any) {
    const page = Math.max(Number(query?.page ?? 1), 1);
    const limit = Math.max(Number(query?.limit ?? 10), 1);

    const qb = this.productRepo.createQueryBuilder('product');

    if (query?.search) {
      qb.andWhere('product.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query?.category) {
      qb.andWhere('product.category = :category', {
        category: query.category,
      });
    }

    if (query?.status) {
      qb.andWhere('product.status = :status', {
        status: query.status,
      });
    }

    const [products, total] = await qb
      .orderBy('product.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: {
        products,
        total,
        page,
        limit,
      },
    };
  }

  async findAvailable() {
    const products = await this.productRepo.find({
      where: { status: ProductStatus.ACTIVE },
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      data: { products },
    };
  }

  findCategories() {
    return {
      success: true,
      data: Object.values(ProductCategory),
    };
  }
}
