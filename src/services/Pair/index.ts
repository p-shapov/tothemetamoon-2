import { toFixed } from 'shared/utils/toFixed';

export class Pair {
  public readonly usd;

  public readonly mul = (n: number) => new Pair(this.eth * n, this.rate);

  public readonly add = (x: Pair) => new Pair(this.eth + x.eth, this.rate);

  public readonly sub = (x: Pair) => new Pair(this.eth - x.eth, this.rate);

  public readonly div = (x: Pair) => new Pair(this.eth / x.eth, this.rate);

  public readonly eq = (x: Pair) => this.eth === x.eth;

  public readonly gte = (x: Pair) => this.eth >= x.eth;

  public readonly lte = (x: Pair) => this.eth <= x.eth;

  public readonly gt = (x: Pair) => this.eth > x.eth;

  public readonly lt = (x: Pair) => this.eth < x.eth;

  public readonly formatToEth = () => `${toFixed(this.eth, 3)} ETH`;

  public readonly formatToUsd = () => `$${toFixed(this.usd)}`;

  public readonly format = () => `${this.formatToEth()} (${this.formatToUsd()})`;

  constructor(public readonly eth: number, public readonly rate: number) {
    this.usd = this.eth * this.rate;
  }
}
