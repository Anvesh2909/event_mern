import { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document {
  _id: string,  
  title: string;
  description?: string;
  location?: string;
  createAt?: Date;
  imageUrl: string;
  startDate?: Date;
  endDate?: Date;
  price?: string;
  isFree?: boolean;
  url?: string;
  category: {
    id: string,
    name: string,
  };
  organizer: {
    id: string,
    firsName: string,
    lastName: string,
  }; 
}

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: String,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;