import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  year: { type: String, enum: ['2022', '2024'], required: true, unique: true },
  orderedIds: [{ type: Schema.Types.ObjectId, ref: 'Partner' }],
});

const Order = models?.Order || model('Order', OrderSchema);
export default Order;
