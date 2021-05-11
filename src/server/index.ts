
import { ApolloServer, gql } from 'apollo-server'
import { AWSS3Uploader } from '../lib/uploaders/s3';
import { GraphQLUpload } from 'graphql-upload';
import dotenv from 'dotenv';

/**
 * Right now, I'm using the Cloudinary Uploader, but you can go 
 * ahead and swap this one out for the S3 one below, or write your own.
 */
dotenv.config();

const s3Uploader = new AWSS3Uploader({ 
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  destinationBucketName: process.env.BUCKET_NAME
});

const server = new ApolloServer({
  typeDefs: gql`
  
    scalar Upload
  
    type UploadedFileResponse {
      filename: String!
      mimetype: String!
      encoding: String!
      url: String!
    }

    type Query {
      hello: String!
    }

    type Mutation {
      singleUpload(file: Upload!): UploadedFileResponse!
      multipleUpload (files: [Upload!]!): UploadedFileResponse!
    }
  `,
  resolvers: {
    Upload: GraphQLUpload,
    Query: {
      hello: () => "Hey!"
    },
    Mutation: {

      singleUpload: s3Uploader.singleFileUploadResolver.bind(s3Uploader),
      multipleUpload: s3Uploader.multipleUploadsResolver.bind(s3Uploader)
    }
  },
  uploads:false,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
