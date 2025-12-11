'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function WithdrawButton() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();
  
  const { 
    data: hash, 
    writeContract, 
    isPending,
    error,
    reset
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    
    try {
      // 调用合约的 withdraw 方法
      writeContract({
        address: '0x8329DB3F8A34BAD9b6288b6D24bfBA3B457580b6' as `0x${string}`,
        abi: [
          {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'withdraw',
      });
      
      toast({
        title: "提取交易已发送",
        description: "您的提取交易已提交，请等待确认。",
      });
    } catch (err) {
      toast({
        title: "错误",
        description: "发送提取交易时出错",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  // 当交易成功时显示成功消息
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "提取成功",
        description: "金额已成功提取到您的钱包！",
      });
      setTimeout(() => {
        reset();
      }, 100);
    }
  }, [isSuccess, toast, reset]);

  // 处理错误
  useEffect(() => {
    if (error) {
      toast({
        title: "提取失败",
        description: error.message,
        variant: "destructive",
      });
      setTimeout(() => {
        reset();
      }, 3000);
    }
  }, [error, toast, reset]);

  return (
    <Button 
      onClick={handleWithdraw}
      disabled={isPending || isConfirming || isWithdrawing}
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
    >
      {(isPending || isConfirming || isWithdrawing) ? (
        <span>处理中...</span>
      ) : (
        <span>提取金额</span>
      )}
    </Button>
  );
}