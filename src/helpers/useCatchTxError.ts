import store from '@/store';
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import { ethers } from 'ethers';

export type TxResponse = TransactionResponse | null;

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (
    fn: () => Promise<TxResponse>
  ) => Promise<TransactionReceipt>;
  loading: boolean;
};

type ErrorData = {
  code: number;
  message: string;
};

type TxError = {
  data: ErrorData;
  error: string;
};

// -32000 is insufficient funds for gas * price + value
const isGasEstimationError = (err: TxError): boolean =>
  err?.data?.code === -32000;
export const isUserRejected = (err) => {
  // provider user rejected error code
  return typeof err === 'object' && 'code' in err && err.code === 4001;
};

const handleNormalError = (error, tx?: TxResponse) => {
  if (tx) {
    store.commit('toastError', {
      summary: 'Error',
      detail:
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
    });
  } else {
    store.commit('toastError', {
      summary: 'Error',
      detail:
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
    });
  }
};

export default function useCatchTxError(error: any, tx: TxResponse) {
  const web3 = store.state.web3;
  const provider = web3.provider ? new ethers.providers.Web3Provider(
    web3.provider
  ) : undefined;
  if (!isUserRejected(error)) {
    if (!tx) {
      handleNormalError(error);
    } else {
      provider
        .call(tx, tx.blockNumber)
        .then(() => {
          handleNormalError(error, tx);
        })
        .catch((err: any) => {
          if (isGasEstimationError(err)) {
            handleNormalError(error, tx);
          } else {
            let recursiveErr = err;

            let reason: string | undefined;

            // for MetaMask
            if (recursiveErr?.data?.message) {
              reason = recursiveErr?.data?.message;
            } else {
              // for other wallets
              // Reference
              // https://github.com/Uniswap/interface/blob/ac962fb00d457bc2c4f59432d7d6d7741443dfea/src/hooks/useSwapCallback.tsx#L216-L222
              while (recursiveErr) {
                reason = recursiveErr.reason ?? recursiveErr.message ?? reason;
                recursiveErr =
                  recursiveErr.error ?? recursiveErr.data?.originalError;
              }
            }

            const REVERT_STR = 'execution reverted: ';
            const indexInfo = reason?.indexOf(REVERT_STR);
            const isRevertedError = indexInfo >= 0;

            if (isRevertedError)
              reason = reason.substring(indexInfo + REVERT_STR.length);

            store.commit('toastError', {
              summary: 'Failed',
              detail: isRevertedError
                ? `Transaction failed with error: ${reason}`
                : 'Transaction failed. For detailed error message:',
            });
          }
        });
    }
  }
}
