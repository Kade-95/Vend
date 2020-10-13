# Vend
Vend is a Vendor Management Service.

EndPoints
1.  User: {
    1.  createUser: {
        use: This is used to create a new User,
        requiredParams: {email: '', currentPassword: '', userName: ''},
        error: Can't add users with duplicate userName or email
    }

    2.  login: {
        use: This is used to login a User,
        requiredParams: {currentPassword: '', userName: ''},
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

    8.  tourUser: {
        use: This is state that a user has been taught how the system works
        requiredParams: {id as user: ''},
    }

    9.  deleteUser: {
        use: This is used to move a user to recycle bin
        requiredParams: {id as user: ''},
    }

    10. logout: {
        use: This is state that a user has been taught how the system works
        requiredParams: {id as user: ''},
    }

    11. changeDp: {
        use: This is to change DP
        requiredParams: {userImage},
    }

    12. deleteDp: {
        use: This is remove Dp
        requiredParams: {},
    }

    13. changeProfile: {
        use: This is change the attributes of a user
        requiredParams: attributes as {...},
    }

    14. changePassword: {
        use: This is change the password of a user
        requiredParams: attributes as {currentPassword},
    }
}






