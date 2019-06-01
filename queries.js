
const memberInsert =(req, res, next) => {
    var text = 'INSERT INTO member(memberid, mfirst, mlast) VALUES($1, $2, $3) RETURNING *'
    var firstName = req.body.n1
    var lastName = req.body.n2
    var memberID = req.body.n3
    const values = [ memberID, firstName, lastName]
    console.log('first name:' + firstName + '   last name:' +  lastName + '   member ID:' + memberID) 
    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log('insert success')
      }
    }) 
    client.query('SELECT * FROM member ORDER BY memberid ASC', (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }


  
module.exports = {
    memberInsert
  }