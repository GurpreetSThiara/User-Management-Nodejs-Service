import mongoose , {Document , Schema} from "mongoose";

export interface Account extends Document {
    name:string;
    type: 'UserM' | 'Nothing';
    industry:'School' | 'Company' | 'Other' | 'Default',
    billing:any;
    ownerId:any;
    tags?:any;
    language:'English';
    createdAt:Date;
    updatedAt:Date;
    contact:any
}

const AccountSchema : Schema = new mongoose.Schema({
    name: {type:String,required:true , unique:true},
    type: {type:String,required:true, enum:['UserM'],
        default:'UserM'
    },
    industry: {type:String,required:true, enum:['Default' ,'School' , 'Company' ,  'Other'],
        default:'Default'
    },
    billing: {type:Object,required:true},
    ownerId: {type:mongoose.Schema.Types.ObjectId,required:true , ref:'User'},
    language:{type:String, enum:['English'], default:'English'},
    contact:{type:mongoose.Schema.Types.ObjectId , ref:'Contact'}
},{
    timestamps:true
})

export default mongoose.model<Account>('Account', AccountSchema);