import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contract } from '../../contracts/entities/contract.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ChatConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  contractId: string;

  @ManyToOne(() => Contract, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contractId' })
  contract: Contract;

  @OneToMany(() => ChatMessage, (message) => message.conversation)
  messages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conversationId: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => ChatConversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: ChatConversation;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @CreateDateColumn()
  createdAt: Date;
}
