import bcrypt from 'bcryptjs'

const users = [
  {
    username: 'natilusky',
    password: bcrypt.hashSync('123123'),
    address: 'shapira',
    email: 'elilosky@walla.com',
    phone: '0252551525',
    comp_name: 'dddd',
    site_url: 'fdfdfd',
    note: 'blabla',
    is_admin: true,
  },
  {
    username: 'dsdsd',
    password: bcrypt.hashSync('123123'),
    address: 'shara',
    email: 'eliloswalla.com',
    phone: '0252525',
    comp_name: 'ddd',
    site_url: 'fddfd',
    note: 'blaba',
    is_admin: false,
  },
]

export default users