import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('token')
export class TokenEntity {
  @PrimaryColumn({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  token: string;

  @Column({ type: 'date', nullable: false })
  expires_at: Date;
}
