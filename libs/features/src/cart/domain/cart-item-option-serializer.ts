export abstract class CartItemOptionSerializer<T> {

  abstract serialize(option: T): string

  abstract deserialize(optionString: string): T;

}
