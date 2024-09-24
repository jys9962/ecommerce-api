import { Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { IPointCommandEntity, PointCommandEntity } from '@/feature/point/repository/entity/point-command.entity';
import { Result } from '@/libs/result/result';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';

@Injectable()
export class PointCommandDynamo {

  constructor(
    private readonly dynamoClient: DynamoDBDocumentClient,
  ) {}

  async find(
    memberId: bigint,
  ): Promise<Result<IPointCommandEntity[], any>> {
    try {
      const output = await this.dynamoClient.send(
        new QueryCommand({
          TableName: 'api',
          KeyConditionExpression: 'pk = :pk',
          ExpressionAttributeValues: {
            ':pk': PointCommandEntity.key('pk', {
              memberId: memberId.toString(),
            }),
          },
          ConsistentRead: true,
        }),
      );
      return Result.ok(
        (output.Items || []) as IPointCommandEntity[],
      );
    } catch (e: unknown) {
      return Result.err();
    }
  }

  async save(entityList: IPointCommandEntity[]): Promise<Result<void, TransactionCanceledException>> {
    try {
      await this.dynamoClient.send(
        new TransactWriteCommand({
          TransactItems: [
            ...entityList.map(
              t => ({
                Put: {
                  TableName: 'api',
                  Item: t,
                  ConditionExpression: 'attribute_not_exists(pk)',
                },
              }),
            ),
          ],
        }),
      );

      return Result.ok();
    } catch (e: unknown) {
      if (e instanceof TransactionCanceledException) {
        return Result.err(e);
      }

      throw e;
    }
  }


}
