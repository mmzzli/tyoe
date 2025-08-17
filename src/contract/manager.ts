// 获取白名单期数

import { useReadContracts } from 'wagmi';
import { contract } from '@/wagmi.ts';
import { manager } from '@/abi/tyoe.ts';

export const getsubscriptionRounds = async () =>{
  const result = useReadContracts({
    contracts:[
      {
        address: contract.dev.manager,
        abi: manager,
        functionName: 'getsubscriptionRounds',
        args:['0']
      }
    ]
  })
}