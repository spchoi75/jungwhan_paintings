'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';

interface SettingsFormProps {
  currentHint?: string;
  onSubmit: (data: {
    current_password: string;
    new_password?: string;
    password_hint?: string;
  }) => Promise<void>;
}

export default function SettingsForm({ currentHint, onSubmit }: SettingsFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState(currentHint || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('현재 비밀번호를 입력해주세요');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다');
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        current_password: currentPassword,
        new_password: newPassword || undefined,
        password_hint: passwordHint || undefined,
      });
      setSuccess('설정이 저장되었습니다');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      {error && (
        <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded">{error}</div>
      )}
      {success && (
        <div className="p-3 bg-green-900/30 text-green-400 text-sm rounded">{success}</div>
      )}

      <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded text-sm text-yellow-400">
        설정을 변경하려면 현재 비밀번호를 입력해야 합니다.
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          현재 비밀번호 <span className="text-red-400">*</span>
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
          required
        />
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-sm font-medium mb-4 text-white">비밀번호 변경</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
              placeholder="변경하지 않으려면 비워두세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-sm font-medium mb-4 text-white">비밀번호 힌트</h3>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">힌트 메시지</label>
          <input
            type="text"
            value={passwordHint}
            onChange={(e) => setPasswordHint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-white bg-[#1a1a1a] text-white placeholder-gray-500"
            placeholder="로그인 페이지에 표시될 힌트"
          />
          <p className="text-xs text-gray-400 mt-1">
            로그인 페이지에서 &quot;비밀번호 힌트&quot; 버튼을 클릭하면 표시됩니다
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <Button type="submit" loading={loading}>
          설정 저장
        </Button>
      </div>
    </form>
  );
}
