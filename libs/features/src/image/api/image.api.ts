export abstract class ImageApi {

  abstract save(
    image: any,
  ): Promise<string>

}
