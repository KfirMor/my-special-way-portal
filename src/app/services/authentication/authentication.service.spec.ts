jest.mock('@angular/common/http');

import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let httpClient: HttpClient;
  let toPromiseFn: jest.Mock;
  const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI
                    6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
  beforeEach(() => {
    httpClient = new HttpClient({} as HttpHandler);
    toPromiseFn = jest.fn();
    (httpClient.post as jest.Mock).mockReturnValue({
      toPromise: toPromiseFn,
    });

    authService = new AuthenticationService(httpClient);
  });

  it('should create localstorage token key on authentication sucess with rememberme enabled', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: mockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    authService.setRememberMe(true);
    await authService.login('someusername', 'somepassword');
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('should not create localstorage token key on authentication sucess with rememberme disabled', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: mockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    authService.setRememberMe(false);
    await authService.login('someusername', 'somepassword');
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('should return null if authentication endpoint returned status code 401', async () => {
    const mockedResponse = {
      status: 401,
    };

    (httpClient.post as jest.Mock).mockImplementation(() => {
      throw mockedResponse;
    });

    const loginResponse = await authService.login('someusername', 'somepassword');

    expect(loginResponse).toBe(null);
  });

  it('should throw an exception if authentication endpoint returned status code 500', () => {
    const mockedResponse = {
      status: 500,
    };

    (httpClient.post as jest.Mock).mockImplementation(() => {
      throw mockedResponse;
    });

    return expect(authService.login('someusername', 'somepassword')).rejects.toEqual({ status: 500 });
  });

  it('should remove token from localstorage logout  if rememberMe', () => {
    authService.setRememberMe(true);
    authService.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should remove token from sessionstorage logout if !rememberMe', () => {
    authService.setRememberMe(false);
    authService.logout();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should return username after successful login', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: mockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    authService.setRememberMe(false);
    await authService.login('someusername', 'somepassword');
    authService.getUsername().toPromise().then((result) => {
      expect(result).toEqual('someuser');
    });
  });
  it('should return token after successful login', async () => {
    const mockedResponse: LoginResponse = {
      accessToken: mockToken,
    };
    toPromiseFn.mockResolvedValue(Promise.resolve(mockedResponse));
    authService.setRememberMe(false);
    await authService.login('someusername', 'somepassword');
    expect(authService.getToken()).toEqual(mockToken);
  });
});
