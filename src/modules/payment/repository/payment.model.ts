import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "payments",
  timestamps: false,
})
export default class PaymentModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare orderId: string;

  @Column({ allowNull: false })
  declare amount: number;

  @Column({ allowNull: false })
  declare status: number;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
