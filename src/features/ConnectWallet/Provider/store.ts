import { flow, makeAutoObservable } from 'mobx';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { autoFetchable } from 'services/AutoFetchable';

import { ModalName, ConnectWalletParams } from './types';

export class ConnectWalletStore {
  public modal: ModalName | null = null;
  public qrcode = autoFetchable({
    fetch: () => this.fetchQrcode,
  });

  public readonly setModal = (modal: ModalName | null) => {
    this.modal = modal;
  };

  constructor(private readonly params: ConnectWalletParams) {
    makeAutoObservable(this);
  }

  private get fetchQrcode() {
    const { connector } = this.params;

    return flow(function* () {
      let qrcode: string | null = null;

      if (connector instanceof CoinbaseWalletConnector) {
        const provider = yield connector.getProvider();

        qrcode = provider.qrUrl ?? null;
      }

      if (connector instanceof WalletConnectConnector) {
        const provider = yield connector.getProvider();

        qrcode = provider.connector.uri ?? null;
      }

      return qrcode;
    });
  }
}
