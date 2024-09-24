import { CreateTableCommandInput } from '@aws-sdk/client-dynamodb';

export namespace MyDynamo {
  export const tableSchema: CreateTableCommandInput = {
    TableName: 'api',
    KeySchema: [
      { AttributeName: 'pk', KeyType: 'HASH' },  // 파티션 키
      { AttributeName: 'sk', KeyType: 'RANGE' }  // 정렬 키
    ],
    AttributeDefinitions: [
      { AttributeName: 'pk', AttributeType: 'S' },
      { AttributeName: 'sk', AttributeType: 'S' },
      { AttributeName: 'gsi1sk', AttributeType: 'S' },
      { AttributeName: 'gsi2sk', AttributeType: 'S' },
      { AttributeName: 'gsi3pk', AttributeType: 'S' },
      { AttributeName: 'gsi3sk', AttributeType: 'S' },
      { AttributeName: 'gsi4pk', AttributeType: 'S' },
      { AttributeName: 'gsi4sk', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'gsi1',
        KeySchema: [
          { AttributeName: 'sk', KeyType: 'HASH' },
          { AttributeName: 'gsi1sk', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      },
      {
        IndexName: 'gsi2',
        KeySchema: [
          { AttributeName: 'sk', KeyType: 'HASH' },
          { AttributeName: 'gsi2sk', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'KEYS_ONLY' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      },
      {
        IndexName: 'gsi3',
        KeySchema: [
          { AttributeName: 'gsi3pk', KeyType: 'HASH' },
          { AttributeName: 'gsi3sk', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      },
      {
        IndexName: 'gsi4',
        KeySchema: [
          { AttributeName: 'gsi4pk', KeyType: 'HASH' },
          { AttributeName: 'gsi4sk', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'KEYS_ONLY' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  } as const;
}
