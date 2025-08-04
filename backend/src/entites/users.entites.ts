import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
@Check('sex = "m" or sex = "f"')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', unique: true, nullable: false, length: 25 })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false, length: 5 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 11 })
  phone: string;

  @Column({ type: 'date', nullable: false })
  birth_day: Date;

  @Column({ type: 'varchar', nullable: false, length: 1 })
  sex: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  last_login: Date;
}
