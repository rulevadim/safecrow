import { User } from '@/types/user';
import { V1LoginResponseData } from '@/services/auth';
import { JwtTokenPayload } from '@/services/token-storage';

export class AuthState {
  user: User = null;
  token: V1LoginResponseData['token'] = null;
  tokenPayload: JwtTokenPayload = null;
}
