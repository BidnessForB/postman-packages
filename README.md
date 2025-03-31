# Handy Postman Packages

## deep-find-items

Recursively find items in a Postman collection.  The SDK does not support this.  

Currently supports finding folders and requests.  

TODO: Expand to support finding examples, variables, etc  

USAGE:  

deepFindItems(items,type,key)  
|--|--|
|items|Array of postman items, eg collection.item  |
|type|`request` or `folder`|
|key|Key of the item to find|


## find-collection-for-request
## initialize
## pop-and-set
## push-to-env-variable
## send-request
## unset vars
## var-utils