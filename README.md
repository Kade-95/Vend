# Vend
Vend is a Vendor Management Service.

EndPoints
1.  createUser: {
        use: This is used to create a new User,
        requiredParams: {email: '', currentPassword: '', userName: ''},
        error: Can't add users with duplicate userName or email
    }

2.  login: {
        use: This is used to login a User,
        requiredParams: {password: '', userName: ''},
        error: checks for correct credentials
    }

3.  isUserActive: {
        use: This is used to check if user is still logged in,
        requiredParams: {id as user: ''},
    }

4.  banUser: {
        use: This is used to ban a user from using the system
        requiredParams: {id as user: '', reason: ''},
    }

5.  suspendUser: {
        use: This is used to suspend a user from using the system
        requiredParams: {id as user: '', reason: ''},
    }

6.  unBanUser: {
        use: This is used to ban remove a user's ban from the system
        requiredParams: {id as user: ''},
    }

7.  unSuspendUser: {
        use: This is used to ban remove a user's suspension from the system
        requiredParams: {id as user: ''},
    }