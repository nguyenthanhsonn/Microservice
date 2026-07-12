import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MovieCast } from './movie-cast.entity';

@Entity('actors')
export class Actor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 160 })
  name: string;

  @OneToMany(() => MovieCast, (movieCast) => movieCast.actor)
  movie_casts: MovieCast[];
}
