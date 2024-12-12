import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PostEntity } from '../../posts/entities/posts.entity';
import { CommentEntity } from '../../posts/entities/comments.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => PostEntity, post => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, comment => comment.user)
  comments: CommentEntity[];
}
