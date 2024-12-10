import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PostEntity } from '../../posts/entities/posts.entity';
import { CommentEntity } from '../../posts/entities/comments.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Store hashed passwords!

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
