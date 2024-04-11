import request from '@/utils/request';

export function getToken(data) {
  return request({
    url: 'users/login',
    method: 'POST',
    data: {
      username: data.username,
      password: data.password,
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
export function getInfo(data) {
    console.log(data)
  return request({
    url: 'Account/userinfo',
    method: 'GET',
  });
}

export function registerUser(data) {
  return request({
    url: 'users/create',
    method: 'POST',
    data: {
      userName: data.userName,
      email: data.email,
      pwd: data.pwd,
    },

  });
}
