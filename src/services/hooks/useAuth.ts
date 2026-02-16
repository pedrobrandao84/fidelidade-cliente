import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';

export const useUsers = () => useQuery({ queryKey: ['users'], queryFn: authApi.users });
export const useLogin = () => useMutation({ mutationFn: authApi.login });
