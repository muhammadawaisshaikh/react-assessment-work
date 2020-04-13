import axios from 'axios'

// export const create = newCustomer => {
//   return axios
//     .post('customers/create', {
//       FirstName: newCustomer.FirstName,
//       LastName: newCustomer.LastName,
//       EmailAddress: newCustomer.EmailAddress,
//       password: newCustomer.password
//     })
//     .then(response => {
//       console.log('Registered')
//     })
// }

//Search costumer
export const search = customer => {
  return axios
    .post('customers/search', {
      email: customer.email,
      password: customer.password,
      phone: customer.phone
    })
      //get the response data
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
