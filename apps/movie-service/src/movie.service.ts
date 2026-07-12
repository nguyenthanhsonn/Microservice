import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { MovieStatus } from './enums/movie-status.enum';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: any) {
    const title = dto.title.trim();

    const existed = await this.movieRepo.findOne({ where: { title } });
    if (existed) throw new BadRequestException('Phim đã tồn tại');

    const movie = await this.movieRepo.save({
      title,
      description: dto.description,
      duration_minutes: dto.duration_minutes,
      poster_url: dto.poster_url ?? null,
      trailer_url: dto.trailer_url ?? null,
      director: dto.director ?? null,
      start_date: dto.start_date ?? null,
      end_date: dto.end_date ?? null,
      age_rating: dto.age_rating ?? null,
      status: dto.status ?? MovieStatus.COMING_SOON,
      supported_formats: dto.supported_formats ?? null,
    });

    return {
      success: true,
      data: {
        message: 'Tạo phim thành công',
        movie,
      },
    };
  }

  async findAll() {
    const movies = await this.movieRepo.find({
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      data: { movies },
    };
  }

  async findDetail(id: string) {
    const movie = await this.movieRepo.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('Không tìm thấy phim');

    return {
      success: true,
      data: { movie },
    };
  }

  async findByStatus(status: MovieStatus | string) {
    const movies = await this.movieRepo.find({
      where: { status: status as MovieStatus },
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      data: { movies },
    };
  }
}
