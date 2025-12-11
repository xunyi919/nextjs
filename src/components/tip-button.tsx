'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export function TipButton({ onTipSuccess }: { onTipSuccess?: () => void }) {
  const { isConnected, address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const recipient = '0x8329DB3F8A34BAD9b6288b6D24bfBA3B457580b6';
  
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

  const handleTip = async () => {
    if (!amount || !recipient) {
      toast({
        title: "错误",
        description: "请输入金额和收款地址",
        variant: "destructive",
      });
      return;
    }

    try {
      // 调用捐赠合约的 donate 方法
      writeContract({
        address: '0x8329DB3F8A34BAD9b6288b6D24bfBA3B457580b6' as `0x${string}`,
        abi: [
          {
            "inputs": [],
            "name": "donate",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          }
        ],
        functionName: 'donate',
        value: BigInt(Number(amount) * 10**18), // 转换为wei
      });
      
      toast({
        title: "交易已发送",
        description: "您的打赏交易已提交，请等待确认。",
      });
    } catch (err) {
      toast({
        title: "错误",
        description: "发送交易时出错",
        variant: "destructive",
      });
    }
  };

  // 当交易成功时关闭对话框
  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      setAmount('');
      
      toast({
        title: "打赏成功",
        description: "感谢您的支持！",
      });
      
      // 调用回调函数通知父组件
      if (onTipSuccess) {
        onTipSuccess();
      }
      
      // 重置交易状态
      setTimeout(() => {
        reset();
      }, 1000);
    }
  }, [isSuccess, onTipSuccess, toast]);

  // 处理错误
  useEffect(() => {
    if (error) {
      toast({
        title: "交易失败",
        description: error.message,
        variant: "destructive",
      });
      
      // 清除错误状态
      setTimeout(() => {
        reset();
      }, 3000);
    }
  }, [error, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0"
        >
          💰 打赏作者
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>打赏作者</DialogTitle>
          <DialogDescription>
            连接您的钱包并通过智能合约向作者发送ETH作为支持
          </DialogDescription>
        </DialogHeader>
        
        {!isConnected ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-center text-gray-600 dark:text-gray-400">
              请先连接您的钱包
            </p>
            <ConnectButton 
              chainStatus="none"
              showBalance={false}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>钱包信息</CardTitle>
                <CardDescription>
                  已连接: {address?.slice(0, 6)}...{address?.slice(-4)}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">合约地址</Label>
                <Input
                  disabled={true}
                  id="recipient"
                  value="0x8329DB3F8A34BAD9b6288b6D24bfBA3B457580b6"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">打赏金额 (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleTip}
              disabled={isPending || isConfirming}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
            >
              {isPending || isConfirming ? (
                <span>处理中...</span>
              ) : (
                <span>发送打赏</span>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}