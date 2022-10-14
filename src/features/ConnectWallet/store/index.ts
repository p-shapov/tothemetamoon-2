import { flow, makeAutoObservable } from 'mobx';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { autoFetchable } from 'services/AutoFetchable';
import { ConnectorId } from 'services/WagmiClient/types';
import { connectors } from 'services/WagmiClient/connectors';

import { ModalName } from './types';

export class ConnectWalletStore {
  public modal: ModalName | null = null;
  public get qrcode() {
    return this.qrcodeAutoFetchable.data;
  }
  public connectorId: null | ConnectorId = null;

  public readonly setConnectorId = (id: ConnectorId | null) => {
    this.connectorId = id;
  };

  public readonly setModal = (modal: ModalName | null) => {
    this.modal = modal;
  };

  constructor() {
    makeAutoObservable(this);
  }

  private readonly qrcodeAutoFetchable = autoFetchable({
    fetch: () => this.fetchQrcode,
  });

  private get fetchQrcode() {
    const connector = this.connectorId && connectors[this.connectorId];

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
