// import Response from '../../../common/response';
// import ddb from '../../../common/dynamodb';
// import { v4 as uuidv4 } from 'uuid';

// const $ENV = process.env.env;

// export const list = async (event) => {
//   let response = new Response();

//   const params = {
//     TableName: `Categories_${$ENV}`,
//   };

//   let scanResults = [];
//   let items;

//   try {
//     do {
//       items = await ddb.scan(params).promise();
//       items.Items.forEach(item => scanResults.push(item));
//       params.ExclusiveStartKey = items.LastEvaluatedKey;
//     } while (typeof items.LastEvaluatedKey != 'undefined')

//     response.body = {
//       categories: scanResults,
//     };
//   } catch (error) {
//     console.error(error);
//   }

//   return response.toObject();
// };

// export const postCategory = async (event) => {



//   let postBody = JSON.parse(event.body)
//   let newCategory = {
//     "_id" : uuidv4(),
//     "name" : postBody.name
//   }

//   let response = new Response();

//   const params = {
//     TableName: `Categories_${$ENV}`,
//     Item: newCategory
//   };

//   try {
//     let res = await ddb.put(params).promise();
//     response.body = { data:res.$response.data };
//   } catch (error) {
//     console.error(error);
//   }

//   return response.toObject();
// };
