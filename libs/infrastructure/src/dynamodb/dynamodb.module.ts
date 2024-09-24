import { Module, OnModuleInit } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CreateTableCommand, DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { MyDynamo } from '@libs/infrastructure/dynamodb/table/create-table.command';

//todo
const env = {} as any;

@Module({
  providers: [
    {
      // todo core module 분리
      provide: DynamoDBDocumentClient,
      useFactory: () =>
        DynamoDBDocumentClient.from(
          new DynamoDBClient({
            credentials: {
              accessKeyId: env.dynamo.awsAccessKey!,
              secretAccessKey: env.dynamo.awsSecretKey!,
            },
            region: env.dynamo.awsRegion,
            ...(
              env.dynamo.endpoint
                ? { endpoint: env.dynamo.endpoint }
                : {}
            ),
          }),
          {
            marshallOptions: {
              convertEmptyValues: false, // false, by default.
              removeUndefinedValues: true, // false, by default.
              convertClassInstanceToMap: false, // false, by default.
            },
            unmarshallOptions: {
              wrapNumbers: false,
            },
          },
        ),
    },
  ],
  exports: [
    DynamoDBDocumentClient,
  ],
})
export class DynamodbModule implements OnModuleInit {

  constructor(
    private readonly client: DynamoDBDocumentClient,
  ) {}

  async onModuleInit() {
    const { TableNames } = await this.client.send(
      new ListTablesCommand({}),
    );

    const existApiTable = TableNames?.some(t => t === 'api');
    if (existApiTable) {
      return;
    }

    await this.client.send(
      new CreateTableCommand(MyDynamo.tableSchema),
    );
  }

}
