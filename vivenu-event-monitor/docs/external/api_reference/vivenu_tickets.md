## Tickets

The Ticket object represents an attendee for an event. Each Ticket has a `Barcode` for identification. Tickets are usually created when [Transactions](https://docs.vivenu.dev/transactions) transition to completed.

## Endpoints

## [The Ticket object](https://docs.vivenu.dev/tickets#the-ticket-object)

#### Attributes

The ID of the seller that ticket belongs to.

The ID of the event the ticket belongs to

The ID of the ticket type this ticket inherits from

The name of the ticket type this ticket inherits from

An ISO Timestamp indicating when the ticket was created.

An ISO Timestamp indicating when the ticket was updated.

The status of the ticket

`VALID``INVALID``RESERVED``DETAILSREQUIRED``BLANK`

The secret token of the ticket

The barcode of the ticket

#### Optional Attributes

Expand all

The name of the ticket owner

The first name of the ticket owner

The last name of the ticket owner

The additional address field of the user of the ticket

The state of the user of the ticket

The country of the user of the ticket

The ID of the root event, if exists

The transaction the ticket originated from

The point of sale the ticket was created on

The ID of an undershop the ticket was purchased through

A UUID of the category the ticket belongs to.

The name of the category the ticket belongs to.

The ID of the time slot this ticket belongs to, if exists

The start time of the time slot this ticket belongs to, if exists.

The ID of the cart item to which the ticket belongs

An array of IDs of cart items which triggered the buy action of the ticket

An ISO 4217 3-character code of the currency

`EUR``USD``GBP``AUD``CHF``THB``ILS``COP``MXN``DKK``NOK``SEK``QAR``CAD``ISK``GTQ``INR``DOP``SGD``PLN``SAR``TTD``ZAR``KYD``HKD``CZK``KRW``JPY``NZD``AED``MAD``TWD``BRL``BWP``NAD`

The original non discounted price for the ticket

The real price for the ticket

Whether all steps for validating the ticket has been made

An ISO Timestamp indicating when the ticket will be expired.

The associated seating object.

seatingInfo.\_type

Required

number float

Indicates the type of seating object. Seat = 6, General Admission = 7.

seatingInfo.statusId

Required

string

The ID of a container holding information about the seating status of the seating object.

#### Optional Attributes

Expand all

The ID of the seating object.

seatingInfo.categoryId

Optional

string

The ID of the category containing the seating object.

If \_type == 7. The name of the general admission.

seatingInfo.seatType

Optional

string

If \_type == 6. The type of the seat. null = normal.

`handicapped``limitedView``foldable`

seatingInfo.sectionName

Optional

string

If \_type == 6. The name of the section where the seat is located.

seatingInfo.groupName

Optional

string

If \_type == 6. The name of the row group where the seat is located.

seatingInfo.rowName

Optional

string

If \_type == 6. The name of the row where the seat is located.

seatingInfo.seatName

Optional

string

If \_type == 6. The seat name.

The entry gate associated with the seating object.

`yourticket``pos``rebooking``upgrade``transfer`

A hashmap of extra fields for the ticket

A UUId indicating in which batch the tickets were created

A counter indicating the order of the ticket in the batch

The delivery type of the ticket

Whether the ticket is ready for delivery

One of

Only one of the following types

One of

Only one of the following types

An array of IDs of events for which the ticket has been blocked

The ID of the origin ticket from which the ticket created

fulfillmentTypeId

Optional

string

The ID of the fulfillment type used to deliver the ticket

The package information of the ticket

packageInfo.packageId

Required

string

The ID of the package

packageInfo.packageConfigId

Required

string

The ID of the package configuration

List of locks on this ticket

#### Optional Attributes

Expand all

One of

Only one of the following types

A list of Add-Ons of the ticket.

addOns\[\].productId

Required

string

addOns\[\].productVariantId

Required

string

The capabilities of the ticket.

One of

Only one of the following types

capabilities\[\].type

Required

string

capabilities\[\].settings

Required

object

capabilities\[\].settings.phases

Required

array

capabilities\[\].settings.phases\[\].condition

Required

object

capabilities\[\].settings.phases\[\].condition.unit

Required

string

The unit in which the offset is specified

capabilities\[\].settings.phases\[\].condition.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

capabilities\[\].settings.phases\[\].condition.target

Optional

string

The target of the relative date

capabilities\[\].settings.phases\[\].refundPercentage

Required

number float

#### Optional Attributes

Expand all

capabilities\[\].settings.returnRelatedItems

Optional

boolean

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Create free Tickets](https://docs.vivenu.dev/tickets#create-free-tickets)

#### Payload

One of

Only one of the following types

The ID of the event containing the ticket cart items.

An array containing all ticket cart items.

The amount of the cart item.

items\[\].ticketTypeId

Required

string

The ID of the ticket type of the cart item.

#### Optional Attributes

Expand all

The type of the cart item.

items\[\].seatingInfo

Optional

object

The associated seating object.

items\[\].seatingInfo.\_type

Required

number float

Indicates the type of seating object. Seat = 6, General Admission = 7.

items\[\].seatingInfo.statusId

Required

string

The ID of a container holding information about the seating status of the seating object.

#### Optional Attributes

Expand all

items\[\].seatingInfo.\_id

Optional

string

The ID of the seating object.

items\[\].seatingInfo.categoryId

Optional

string

The ID of the category containing the seating object.

items\[\].seatingInfo.name

Optional

string

If \_type == 7. The name of the general admission.

items\[\].seatingInfo.seatType

Optional

string

If \_type == 6. The type of the seat. null = normal.

`handicapped``limitedView``foldable`

items\[\].seatingInfo.sectionName

Optional

string

If \_type == 6. The name of the section where the seat is located.

items\[\].seatingInfo.groupName

Optional

string

If \_type == 6. The name of the row group where the seat is located.

items\[\].seatingInfo.rowName

Optional

string

If \_type == 6. The name of the row where the seat is located.

items\[\].seatingInfo.seatName

Optional

string

If \_type == 6. The seat name.

items\[\].seatingInfo.gate

Optional

string

The entry gate associated with the seating object.

items\[\].asHardTicket

Optional

boolean

Whether this ticket is a hard ticket.

items\[\].triggeredBy

Optional

An ID or an array of IDs of other cart items which triggered the buy action of the cart item.

One of

Only one of the following types

items\[\].triggeredAutomations

Optional

boolean

Whether the cart item triggered automations.

items\[\].id

Optional

Deprecated

string

The ID of the ticket type of the cart item.

The ID of the existing customer.

#### Optional Attributes

Expand all

requiresPersonalization

Optional

boolean

seatingReservationToken

Optional

string

Was this section helpful?

YesNo

```
{  "eventId": "string",  "underShopId": "string",  "items": [    {      "_id": "string",      "type": "ticket",      "amount": 1,      "ticketTypeId": "string",      "seatingInfo": {        "_id": "string",        "_type": 6,        "categoryId": "string",        "statusId": "string",        "name": "string",        "seatType": "handicapped",        "sectionName": "string",        "groupName": "string",        "rowName": "string",        "seatName": "string",        "gate": "string"      },      "asHardTicket": true,      "triggeredBy": "string",      "triggeredAutomations": true,      "id": "string"    }  ],  "sendMail": true,  "customMessage": "string",  "requiresPersonalization": true,  "seatingReservationToken": "string",  "batchId": "string",  "salesChannelId": "string",  "customerId": "string"}
```

```
[  {    "_id": "string",    "sellerId": "string",    "company": "string",    "email": "string",    "name": "string",    "firstname": "string",    "lastname": "string",    "street": "string",    "line2": "string",    "city": "string",    "postal": "string",    "state": "string",    "country": "string",    "eventId": "string",    "rootEventId": "string",    "transactionId": "string",    "posId": "string",    "underShopId": "string",    "categoryRef": "string",    "categoryName": "string",    "ticketTypeId": "string",    "slotId": "string",    "slotStartTime": "string",    "cartItemId": "string",    "triggeredBy": [      "string"    ],    "ticketName": "string",    "currency": "EUR",    "regularPrice": 10.5,    "realPrice": 10.5,    "completed": true,    "createdAt": "2030-01-23T23:00:00.123Z",    "updatedAt": "2030-01-23T23:00:00.123Z",    "expiresAt": "2030-01-23T23:00:00.123Z",    "status": "VALID",    "secret": "string",    "barcode": "string",    "seat": "string",    "seatingInfo": {      "_id": "string",      "_type": 6,      "categoryId": "string",      "statusId": "string",      "name": "string",      "seatType": "handicapped",      "sectionName": "string",      "groupName": "string",      "rowName": "string",      "seatName": "string",      "gate": "string"    },    "type": "SINGLE",    "origin": "yourticket",    "extraFields": {},    "batch": "string",    "batchCounter": 10.5,    "deliveryType": "HARD",    "readyForDelivery": true,    "customMessage": "string",    "priceCategoryId": "string",    "entryPermissions": [      []    ],    "customerId": "string",    "history": [      []    ],    "personalized": true,    "excludedEventIds": [      "string"    ],    "originTicketId": "string",    "fulfillmentTypeId": "string",    "packageInfo": {      "packageId": "string",      "packageConfigId": "string",      "name": "string"    },    "__v": 1,    "_locks": [      {        "by": "string",        "at": "2030-01-23T23:00:00.123Z",        "eventId": "string",        "type": []      }    ],    "addOns": [      {        "productId": "string",        "productVariantId": "string",        "name": "string"      }    ],    "capabilities": [      {        "type": "self_service_return",        "settings": {          "returnRelatedItems": true,          "phases": [            {              "condition": {                "target": "string",                "unit": "hours",                "offset": 1              },              "refundPercentage": 10.5            }          ]        }      }    ]  }]
```

## [Get a Ticket](https://docs.vivenu.dev/tickets#get-a-ticket)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Update a Ticket](https://docs.vivenu.dev/tickets#update-a-ticket)

#### Payload

#### Optional Attributes

Expand all

Was this section helpful?

YesNo

```
{  "barcode": "string",  "extraFields": {},  "meta": {}}
```

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Validate Ticket](https://docs.vivenu.dev/tickets#validate-ticket)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Require Details](https://docs.vivenu.dev/tickets#require-details)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

PUBLIC

## [Invalidate Ticket](https://docs.vivenu.dev/tickets#invalidate-ticket)

#### Query

The secret of the ticket if you use the endpoint without authentication

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Reissue Ticket](https://docs.vivenu.dev/tickets#reissue-ticket)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Invalidate Tickets of a Batch](https://docs.vivenu.dev/tickets#invalidate-tickets-of-a-batch)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
[  {    "_id": "string",    "sellerId": "string",    "company": "string",    "email": "string",    "name": "string",    "firstname": "string",    "lastname": "string",    "street": "string",    "line2": "string",    "city": "string",    "postal": "string",    "state": "string",    "country": "string",    "eventId": "string",    "rootEventId": "string",    "transactionId": "string",    "posId": "string",    "underShopId": "string",    "categoryRef": "string",    "categoryName": "string",    "ticketTypeId": "string",    "slotId": "string",    "slotStartTime": "string",    "cartItemId": "string",    "triggeredBy": [      "string"    ],    "ticketName": "string",    "currency": "EUR",    "regularPrice": 10.5,    "realPrice": 10.5,    "completed": true,    "createdAt": "2030-01-23T23:00:00.123Z",    "updatedAt": "2030-01-23T23:00:00.123Z",    "expiresAt": "2030-01-23T23:00:00.123Z",    "status": "VALID",    "secret": "string",    "barcode": "string",    "seat": "string",    "seatingInfo": {      "_id": "string",      "_type": 6,      "categoryId": "string",      "statusId": "string",      "name": "string",      "seatType": "handicapped",      "sectionName": "string",      "groupName": "string",      "rowName": "string",      "seatName": "string",      "gate": "string"    },    "type": "SINGLE",    "origin": "yourticket",    "extraFields": {},    "batch": "string",    "batchCounter": 10.5,    "deliveryType": "HARD",    "readyForDelivery": true,    "customMessage": "string",    "priceCategoryId": "string",    "entryPermissions": [      []    ],    "customerId": "string",    "history": [      []    ],    "personalized": true,    "excludedEventIds": [      "string"    ],    "originTicketId": "string",    "fulfillmentTypeId": "string",    "packageInfo": {      "packageId": "string",      "packageConfigId": "string",      "name": "string"    },    "__v": 1,    "_locks": [      {        "by": "string",        "at": "2030-01-23T23:00:00.123Z",        "eventId": "string",        "type": []      }    ],    "addOns": [      {        "productId": "string",        "productVariantId": "string",        "name": "string"      }    ],    "capabilities": [      {        "type": "self_service_return",        "settings": {          "returnRelatedItems": true,          "phases": [            {              "condition": {                "target": "string",                "unit": "hours",                "offset": 1              },              "refundPercentage": 10.5            }          ]        }      }    ]  }]
```

## [Change Ticket's seat](https://docs.vivenu.dev/tickets#change-tickets-seat)

#### Payload

seatingReservationToken

Required

string

#### Optional Attributes

Expand all

Was this section helpful?

YesNo

```
{  "seatingInfo": {},  "seatingReservationToken": "string",  "sendMail": true,  "freeSeat": true}
```

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Prepare Ticket for delivery](https://docs.vivenu.dev/tickets#prepare-ticket-for-delivery)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Send Ticket per mail](https://docs.vivenu.dev/tickets#send-ticket-per-mail)

#### Payload

Was this section helpful?

YesNo

```
{  "email": "random@mail.com"}
```

```
{  "email": "random@mail.com"}
```

PUBLIC

## [Personalize a Ticket](https://docs.vivenu.dev/tickets#personalize-a-ticket)

#### Payload

#### Optional Attributes

Expand all

The first name on the ticket.

The last name on the ticket.

Key-value pairs of extra fields for the ticket.

Was this section helpful?

YesNo

```
{  "name": "string",  "firstname": "string",  "lastname": "string",  "extraFields": {}}
```

```
{  "_id": "string",  "sellerId": "string",  "company": "string",  "email": "string",  "name": "string",  "firstname": "string",  "lastname": "string",  "street": "string",  "line2": "string",  "city": "string",  "postal": "string",  "state": "string",  "country": "string",  "eventId": "string",  "rootEventId": "string",  "transactionId": "string",  "posId": "string",  "underShopId": "string",  "categoryRef": "string",  "categoryName": "string",  "ticketTypeId": "string",  "slotId": "string",  "slotStartTime": "string",  "cartItemId": "string",  "triggeredBy": [    "string"  ],  "ticketName": "string",  "currency": "EUR",  "regularPrice": 10.5,  "realPrice": 10.5,  "completed": true,  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "expiresAt": "2030-01-23T23:00:00.123Z",  "status": "VALID",  "secret": "string",  "barcode": "string",  "seat": "string",  "seatingInfo": {    "_id": "string",    "_type": 6,    "categoryId": "string",    "statusId": "string",    "name": "string",    "seatType": "handicapped",    "sectionName": "string",    "groupName": "string",    "rowName": "string",    "seatName": "string",    "gate": "string"  },  "type": "SINGLE",  "origin": "yourticket",  "extraFields": {},  "batch": "string",  "batchCounter": 10.5,  "deliveryType": "HARD",  "readyForDelivery": true,  "customMessage": "string",  "priceCategoryId": "string",  "entryPermissions": [    []  ],  "customerId": "string",  "history": [    []  ],  "personalized": true,  "excludedEventIds": [    "string"  ],  "originTicketId": "string",  "fulfillmentTypeId": "string",  "packageInfo": {    "packageId": "string",    "packageConfigId": "string",    "name": "string"  },  "__v": 1,  "_locks": [    {      "by": "string",      "at": "2030-01-23T23:00:00.123Z",      "eventId": "string",      "type": []    }  ],  "addOns": [    {      "productId": "string",      "productVariantId": "string",      "name": "string"    }  ],  "capabilities": [    {      "type": "self_service_return",      "settings": {        "returnRelatedItems": true,        "phases": [          {            "condition": {              "target": "string",              "unit": "hours",              "offset": 1            },            "refundPercentage": 10.5          }        ]      }    }  ]}
```

## [Get all Tickets](https://docs.vivenu.dev/tickets#get-all-tickets)

#### Query

Filter tickets by ticket holder name

Filter tickets by barcode

An ISO timestamp to filter tickets created on or after this date

An ISO timestamp to filter tickets created on or before this date

Filter by a comma(,) separated list of statuses

Filter by a comma(,) separated list of deliverTypes

Filter by a comma(,) separated list of event IDs

Filter tickets with a seat by status ID

Filter tickets with a seat by general admission name

Filter tickets with a seat by section name

Filter tickets with a seat by group name

Filter tickets with a seat by row name

Filter tickets by seat name

Filter tickets by customer ID

Filter tickets by purchase intent ID

Filter tickets by the ID of the checkout

Filter tickets by the ID of the subscription

Range of dates indicating when the ticket was last updated in ISO format.

#### Optional Attributes

Expand all

value is greater than or equal

value is less than or equal

Filter tickets by batch counter

#### Optional Attributes

Expand all

batchCounter.$gte

Optional

number float

value is greater than or equal

batchCounter.$lte

Optional

number float

value is less than or equal

Filter tickets by package ID

A limit on the number of objects to be returned. Can range between 1 and 1000.

The number of objects to skip for the requested result

Was this section helpful?

YesNo

```
{  "rows": [    {      "_id": "string",      "sellerId": "string",      "company": "string",      "email": "string",      "name": "string",      "firstname": "string",      "lastname": "string",      "street": "string",      "line2": "string",      "city": "string",      "postal": "string",      "state": "string",      "country": "string",      "eventId": "string",      "rootEventId": "string",      "transactionId": "string",      "posId": "string",      "underShopId": "string",      "categoryRef": "string",      "categoryName": "string",      "ticketTypeId": "string",      "slotId": "string",      "slotStartTime": "string",      "cartItemId": "string",      "triggeredBy": [        "string"      ],      "ticketName": "string",      "currency": "EUR",      "regularPrice": 10.5,      "realPrice": 10.5,      "completed": true,      "createdAt": "2030-01-23T23:00:00.123Z",      "updatedAt": "2030-01-23T23:00:00.123Z",      "expiresAt": "2030-01-23T23:00:00.123Z",      "status": "VALID",      "secret": "string",      "barcode": "string",      "seat": "string",      "seatingInfo": {        "_id": "string",        "_type": 6,        "categoryId": "string",        "statusId": "string",        "name": "string",        "seatType": "handicapped",        "sectionName": "string",        "groupName": "string",        "rowName": "string",        "seatName": "string",        "gate": "string"      },      "type": "SINGLE",      "origin": "yourticket",      "extraFields": {},      "batch": "string",      "batchCounter": 10.5,      "deliveryType": "HARD",      "readyForDelivery": true,      "customMessage": "string",      "priceCategoryId": "string",      "entryPermissions": [        []      ],      "customerId": "string",      "history": [        []      ],      "personalized": true,      "excludedEventIds": [        "string"      ],      "originTicketId": "string",      "fulfillmentTypeId": "string",      "packageInfo": {        "packageId": "string",        "packageConfigId": "string",        "name": "string"      },      "__v": 1,      "_locks": [        {          "by": "string",          "at": "2030-01-23T23:00:00.123Z",          "eventId": "string",          "type": []        }      ],      "addOns": [        {          "productId": "string",          "productVariantId": "string",          "name": "string"        }      ],      "capabilities": [        {          "type": "self_service_return",          "settings": {            "returnRelatedItems": true,            "phases": [              {                "condition": {                  "target": "string",                  "unit": "hours",                  "offset": 1                },                "refundPercentage": 10.5              }            ]          }        }      ]    }  ],  "total": 1}
```

PUBLIC

## [Get Tickets of Batch](https://docs.vivenu.dev/tickets#get-tickets-of-batch)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
[  {    "_id": "string",    "sellerId": "string",    "company": "string",    "email": "string",    "name": "string",    "firstname": "string",    "lastname": "string",    "street": "string",    "line2": "string",    "city": "string",    "postal": "string",    "state": "string",    "country": "string",    "eventId": "string",    "rootEventId": "string",    "transactionId": "string",    "posId": "string",    "underShopId": "string",    "categoryRef": "string",    "categoryName": "string",    "ticketTypeId": "string",    "slotId": "string",    "slotStartTime": "string",    "cartItemId": "string",    "triggeredBy": [      "string"    ],    "ticketName": "string",    "currency": "EUR",    "regularPrice": 10.5,    "realPrice": 10.5,    "completed": true,    "createdAt": "2030-01-23T23:00:00.123Z",    "updatedAt": "2030-01-23T23:00:00.123Z",    "expiresAt": "2030-01-23T23:00:00.123Z",    "status": "VALID",    "secret": "string",    "barcode": "string",    "seat": "string",    "seatingInfo": {      "_id": "string",      "_type": 6,      "categoryId": "string",      "statusId": "string",      "name": "string",      "seatType": "handicapped",      "sectionName": "string",      "groupName": "string",      "rowName": "string",      "seatName": "string",      "gate": "string"    },    "type": "SINGLE",    "origin": "yourticket",    "extraFields": {},    "batch": "string",    "batchCounter": 10.5,    "deliveryType": "HARD",    "readyForDelivery": true,    "customMessage": "string",    "priceCategoryId": "string",    "entryPermissions": [      []    ],    "customerId": "string",    "history": [      []    ],    "personalized": true,    "excludedEventIds": [      "string"    ],    "originTicketId": "string",    "fulfillmentTypeId": "string",    "packageInfo": {      "packageId": "string",      "packageConfigId": "string",      "name": "string"    },    "__v": 1,    "_locks": [      {        "by": "string",        "at": "2030-01-23T23:00:00.123Z",        "eventId": "string",        "type": []      }    ],    "addOns": [      {        "productId": "string",        "productVariantId": "string",        "name": "string"      }    ],    "capabilities": [      {        "type": "self_service_return",        "settings": {          "returnRelatedItems": true,          "phases": [            {              "condition": {                "target": "string",                "unit": "hours",                "offset": 1              },              "refundPercentage": 10.5            }          ]        }      }    ]  }]
```