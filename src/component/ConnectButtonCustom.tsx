import { ConnectButton } from '@rainbow-me/rainbowkit';
import './ConnectButtonCustom.scss'
import { useIntl } from 'react-intl';
import Iconfont from '@/component/Iconfont.tsx';
export const ConnectButtonCustom = () => {
  const intl = useIntl()
  return (
    <ConnectButton.Custom>
      {({
          account,
          chain,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button className={'connect-button'} onClick={openConnectModal} type="button">
                    <Iconfont className={'icon-connect-button'} icon={'icon-qianbao'}></Iconfont>
                    {intl.formatMessage({id:'connect-wallet-button'})}
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return account.displayName;
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};