import { Schema, model, models } from 'mongoose';
import { EDITION_YEARS } from '@/constants/editions';

const OrderSchema = new Schema({
  year: { type: String, enum: EDITION_YEARS, required: true, unique: true },
  orderedIds: [{ type: Schema.Types.ObjectId, ref: 'Partner' }],
});

const Order = models?.Order || model('Order', OrderSchema);
export default Order;
