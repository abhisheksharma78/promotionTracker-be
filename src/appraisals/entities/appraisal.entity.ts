import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AppraisalStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity('appraisals')
export class Appraisal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'employeeId' })
  employee: User;

  @Column()
  employeeId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column()
  managerId: string;

  @Column()
  currentPosition: string;

  @Column()
  proposedPosition: string;

  @Column('text')
  justification: string;

  @Column({
    type: 'enum',
    enum: AppraisalStatus,
    default: AppraisalStatus.PENDING
  })
  status: AppraisalStatus;

  @Column({ type: 'text', nullable: true })
  managerComments?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentSalary?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  proposedSalary?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
