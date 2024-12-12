import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PostEntity } from './posts.entity';
import { UserEntity } from '../../users/entities/users.entity';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => PostEntity, post => post.comments, { onDelete: 'CASCADE' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;
}
