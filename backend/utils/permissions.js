//permissions for different behavior

const BOOKS_ROUTE = '/api/books';
const CIRCLES_ROUTE = '/api/circles';
const APPROVALS_ROUTE = '/api/approvals';
const MEMBERS_ROUTE = '/api/members';
const MESSAGES_ROUTE = '/api/messages';

const ADMIN = {
    admin: true,
    owner: false,
    host: false,
    member: false
};

const OWNER = {
    admin: true,
    owner: true,
    host: false,
    member: false
};

const HOST = {
    admin: true,
    owner: true,
    host: true,
    member: false
};

const MEMBER = {
    admin: true,
    owner: true,
    host: true,
    member: true
};




const permissions = {
    [BOOKS_ROUTE]: [['any', ADMIN]],
    [APPROVALS_ROUTE]: [['any', MEMBER]],
    [CIRCLES_ROUTE]: [['DELETE', OWNER], ['PUT', HOST]],
    [MEMBERS_ROUTE]: [['PUT', HOST], ['DELETE', OWNER]],
    [MESSAGES_ROUTE]: [['any', MEMBER]],
}
