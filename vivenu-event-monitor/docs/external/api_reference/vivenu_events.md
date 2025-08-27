## Events

Event objects represent an Event where tickets can be purchased for. Extended periods, like a season, are also represented through an event.

## Endpoints

## [The Event object](https://docs.vivenu.dev/tickets#the-event-object)

#### Attributes

An ISO timestamp indicating when the event starts

An ISO timestamp indicating when the event ends

Maximum amount of tickets of the event

maxAmountPerOrder

Required

number float

Maximum amount of tickets per order of the event

#### Optional Attributes

Expand all

The ID of the seller owning this event

A description about the event. Description is in RichText - JSON format.

The name of the location where the event takes place

The street of the location where the event takes place

The city of the location where the event takes place

The postal code of the location where the event takes place

The country code of the location where the event takes place

A footer image for the ticket PDF of the event

A background image for the ticket PDF of the event

A header image for the ticket shop of the event

An array of groups of ticket types of the event

The ID of of the ticket group of the event

The name of the ticket group of the event

An array of ID's of ticket types of the event

An array of discount groups of the event

discountGroups\[\].\_id

Required

string

The ID of the discount group of the event

discountGroups\[\].name

Required

string

The name of the discount group of the event

discountGroups\[\].value

Required

number float

The value of the discount group

#### Optional Attributes

Expand all

discountGroups\[\].rules

Optional

array

An array of rules of the discount group

discountGroups\[\].rules\[\].\_id

Required

string

The ID of the discount group rule

discountGroups\[\].rules\[\].min

Required

number float

Minimum amount of tickets where the discount is valid

discountGroups\[\].rules\[\].max

Required

number float

Maximum amount of tickets where the discount is valid

#### Optional Attributes

Expand all

discountGroups\[\].rules\[\].group

Optional

string

The ID of the discount group

discountGroups\[\].rules\[\].type

Optional

string

The type of the discount rule. ticketGroups is the type for tickets. cartSum is the type for sum of a cart

discountGroups\[\].discountType

Optional

string

The type of the discount group. TOTAL = absolute discount. PERCENTAGE = percentage discount. fix = fixed discount. var = variable discount

`TOTAL``PERCENTAGE``fix``var``fixPerItem`

cartAutomationRules

Optional

array

An array of automation rules for carts of the event

cartAutomationRules\[\].\_id

Required

string

The ID of the cart automation rule

cartAutomationRules\[\].name

Required

string

The name of the automation rule for carts of the event

cartAutomationRules\[\].triggerType

Required

string

The trigger type of the automation rule.

cartAutomationRules\[\].triggerTargetGroup

Required

string

The trigger target group of the rule. The ID of a ticket group

cartAutomationRules\[\].thenType

Required

string

The type of thenType of the rule. autoAdd = is the type to add automatically to cart. chooseFrom = is the type to choose from e.g. another ticket group

#### Optional Attributes

Expand all

cartAutomationRules\[\].thenTargets

Optional

array

The target of the then type

cartAutomationRules\[\].thenTargets\[\].\_id

Required

string

The ID of the then target

#### Optional Attributes

Expand all

cartAutomationRules\[\].thenTargets\[\].thenTargetGroup

Optional

string

The ID of the ticket group 'then' refers to

cartAutomationRules\[\].thenTargets\[\].thenTargetMin

Optional

number float

Minimum amount of tickets where the then action is valid

cartAutomationRules\[\].thenTargets\[\].thenTargetMax

Optional

number float

Maximum amount of tickets where the then action is valid

An array of POS discounts of the event

posDiscounts\[\].\_id

Required

string

The ID of the POS discount

posDiscounts\[\].name

Required

string

The name of the POS discount

posDiscounts\[\].value

Required

number float

The value of the POS discount

#### Optional Attributes

Expand all

posDiscounts\[\].discountType

Optional

string

The type of the POS discount

`TOTAL``PERCENTAGE``fix``var``fixPerItem`

An array of ticket categories of the event

The ID of the ticket category of the event

categories\[\].name

Required

string

The name of the ticket category of the event

#### Optional Attributes

Expand all

categories\[\].description

Optional

string

The description of the ticket category of the event

categories\[\].seatingReference

Optional

string

The ID of the seating category

The reference to identify the seating category

categories\[\].amount

Optional

number float

The amount of available tickets of the category of the event

categories\[\].recommendedTicket

Optional

string

Recommended ticket of the category

categories\[\].maxAmountPerOrder

Optional

number float

Maximum amount per order of the category

categories\[\].listWithoutSeats

Optional

boolean

Whether this category can be sold without seats

An array of ticket types of the event

The ID of the ticket type of the event

The name of the ticket type of the event

The price of the ticket type of the event

The amount of the ticket type of the event

Whether the ticket type of the event is active

#### Optional Attributes

Expand all

tickets\[\].description

Optional

string

The description of the ticket type of the event

The image of the ticket type of the event

The font color of the ticket type of the event

tickets\[\].posActive

Optional

boolean

Whether POS for the ticket type of the event is active

tickets\[\].categoryRef

Optional

string

The reference of the category of the ticket type of the event

tickets\[\].ignoredForStartingPrice

Optional

boolean

Whether the price of the ticket type should be ignored on starting price determination of the event

tickets\[\].conditionalAvailability

Optional

boolean

Whether rules can be operated on the ticket type

tickets\[\].ticketBackground

Optional

string

The background for the ticket PDF of the ticket type

An array of rules for the ticket type of the event

tickets\[\].rules\[\].\_id

Required

string

The ID of the ticket type rule

tickets\[\].rules\[\].ticketGroup

Required

string

The ID of the ticket group to operate the rule on

tickets\[\].rules\[\].min

Required

number float

Minimum amount of tickets where the rule is active

tickets\[\].rules\[\].max

Required

number float

Maximum amount of tickets where the rule is active

tickets\[\].requiresPersonalization

Optional

Deprecated

boolean

Deprecated, use `requiresPersonalizationMode` instead

tickets\[\].requiresPersonalizationMode

Optional

string

Whether the ticket type of the event needs personalization

tickets\[\].requiresExtraFields

Optional

Deprecated

boolean

Deprecated, use `requiresExtraFieldsMode` instead

tickets\[\].requiresExtraFieldsMode

Optional

string

Whether the ticket type of the event needs extra fields

tickets\[\].repersonalizationFee

Optional

number float

The per-ticket fee for repersonalization.

tickets\[\].sortingKey

Optional

number float

The key to sort the ticket type within the ticket group

tickets\[\].enableHardTicketOption

Optional

boolean

Whether the ticket type is a hard ticket

tickets\[\].forceHardTicketOption

Optional

boolean

Whether to force the hard ticket option

tickets\[\].maxAmountPerOrder

Optional

number float

Maximum amount per order of the ticket type

tickets\[\].minAmountPerOrder

Optional

number float

Minimum amount per order of the ticket type

tickets\[\].minAmountPerOrderRule

Optional

number float

Minimum amount of the ticket type, where the minAmountPerOrder goes active

tickets\[\].taxRate

Optional

number float

The tax rate of the ticket type of the event

tickets\[\].styleOptions

Optional

object

Style options of the ticket type

#### Optional Attributes

Expand all

tickets\[\].styleOptions.thumbnailImage

Optional

string

Thumbnail of the ticket type, which will be displayed on checkout

tickets\[\].styleOptions.showAvailable

Optional

boolean

Whether to show availability of the ticket type

tickets\[\].styleOptions.hiddenInSelectionArea

Optional

boolean

Whether to show this ticket in the selection area

tickets\[\].priceCategoryId

Optional

string

The ID of the price category of the ticket type

tickets\[\].entryPermissions

Optional

array<string>

An array of IDs of entry permissions where the ticket buyer has access to certain areas

tickets\[\].ignoreForMaxAmounts

Optional

boolean

Do not include tickets if this typw when calculating available amount in categories and event

tickets\[\].expirationSettings

Optional

object

Expiration settings of the ticket type.

#### Optional Attributes

Expand all

tickets\[\].expirationSettings.enabled

Optional

boolean

Whether expiration enabled for the event ticket types

tickets\[\].expirationSettings.expiresAfter

Optional

object

If enabled = true. A relatve date specification until when ticket is valid.

tickets\[\].expirationSettings.expiresAfter.unit

Required

string

The unit in which the offset is specified

tickets\[\].expirationSettings.expiresAfter.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].expirationSettings.expiresAfter.target

Optional

string

The target of the relative date

tickets\[\].barcodePrefix

Optional

string

Characters that precede the barcodes of tickets.

tickets\[\].salesStart

Optional

object

A relative date before the end of the event, when the sale of this ticket type starts

tickets\[\].salesStart.unit

Required

string

The unit in which the offset is specified

tickets\[\].salesStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].salesStart.target

Optional

string

The target of the relative date

tickets\[\].salesEnd

Optional

object

A relative date before the end of the event, when the sale of this ticket type ends

tickets\[\].salesEnd.unit

Required

string

The unit in which the offset is specified

tickets\[\].salesEnd.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].salesEnd.target

Optional

string

The target of the relative date

tickets\[\].transferSettings

Optional

object

Transfer settings of the ticket type.

#### Optional Attributes

Expand all

tickets\[\].transferSettings.mode

Optional

string

Ticket transfer mode.

tickets\[\].transferSettings.expiresAfter

Optional

object

If 'mode = ALLOWED'. A relatve date specification until when ticket transfer is valid.

tickets\[\].transferSettings.expiresAfter.unit

Required

string

The unit in which the offset is specified

tickets\[\].transferSettings.expiresAfter.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].transferSettings.expiresAfter.target

Optional

string

The target of the relative date

tickets\[\].transferSettings.retransferMode

Optional

string

Ticket retransfer mode.

tickets\[\].transferSettings.allowedUntil

Optional

object

If 'mode = ALLOWED'. A relatve date specification until the end of the event where ticket transfer is possible.

tickets\[\].transferSettings.allowedUntil.unit

Required

string

The unit in which the offset is specified

tickets\[\].transferSettings.allowedUntil.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].transferSettings.allowedUntil.target

Optional

string

The target of the relative date

tickets\[\].transferSettings.hardTicketsMode

Optional

string

If 'hardTicketsMode = ALLOWED' then hard tickets transfers allowed.

tickets\[\].scanSettings

Optional

object

Scan settings of the ticket type.

#### Optional Attributes

Expand all

tickets\[\].scanSettings.feedback

Optional

string

Feedback mode during scanning of the ticket

tickets\[\].deliverySettings

Optional

object

Delivery settings of the ticket type.

#### Optional Attributes

Expand all

tickets\[\].deliverySettings.wallet

Optional

object

#### Optional Attributes

Expand all

tickets\[\].deliverySettings.wallet.enabled

Optional

string

tickets\[\].deliverySettings.pdf

Optional

object

#### Optional Attributes

Expand all

tickets\[\].deliverySettings.pdf.enabled

Optional

string

Custom key-value data. Metadata is useful for storing additional, structured information on an object.

An ISO timestamp indicating when the event was created

An ISO timestamp indicating when the event was updated

An ISO timestamp indicating when the event sale starts

An ISO timestamp indicating when the event sale ends

maxAmountPerCustomer

Optional

number float

Maximum amount of tickets per customer of the event

maxTransactionsPerCustomer

Optional

number float

Maximum amount of transactions per customer of the event

minAmountPerOrder

Optional

number float

Minimum amount of tickets per order

An array of customer tags of the event

An array of customer segments of the event

Whether the countdown should be visible till event start

Whether the event should be hide in listings

An ISO timestamp indicating when the event is visible in listings.

Custom settings of the event

customSettings.\_id

Required

string

The ID of the custom settings of the event

#### Optional Attributes

Expand all

customSettings.hideTicketsInTransactionPage

Optional

boolean

Whether the ticket types of the event should be visible on transaction page

customSettings.dontSendTicketMail

Optional

boolean

Whether an email should be sent of tickets of the event

customSettings.dontSendBookingConfirmationMail

Optional

boolean

Whether an email should be sent for booking confirmation

customSettings.customMailHeaderImage

Optional

string

A custom header image of the mail for ticket types of the event

customSettings.customTransactionCompletionText

Optional

string

A custom transaction completion text for completed transactions of the event

customSettings.disableAppleWallet

Optional

Deprecated

boolean

Whether the Apple and Google Wallet functionality should be disabled on the event. Deprecated: use event.deliverySettings.wallet instead

customSettings.disablePdfTickets

Optional

Deprecated

boolean

Whether the PDF tickets download functionality should be disabled on the event. Deprecated: use event.deliverySettings.pdf instead

customSettings.showStartDate

Optional

boolean

Whether the start date of the event should be visible on listings

customSettings.showStartTime

Optional

boolean

Whether the start time of the event should be visible on listings

customSettings.showEndDate

Optional

boolean

Whether the end date of the event should be visible on listings

customSettings.showEndTime

Optional

boolean

Whether the end time of the event should be visible on listings

customSettings.showTimeRangeInListing

Optional

Deprecated

boolean

Whether the end time of the event should be visible on listings

customSettings.showTimeRangeInTicket

Optional

boolean

Whether the time range of the event should be visible on ticket PDFs

customSettings.customCheckoutCSS

Optional

string

Custom CSS styling of the checkout of the event

customSettings.useCustomCheckoutBrand

Optional

boolean

Whether the checkout of the event should use custom brand

customSettings.customCheckoutBrand

Optional

string

A custom checkout brand of the event

customSettings.hideLogoInCheckout

Optional

boolean

Whether the logo should be hide on the checkout of the event

customSettings.customEventPageHTML

Optional

string

A custom HTML of the event page

customSettings.customEventPageCSS

Optional

string

A custom css styling of the event page

customSettings.customConfirmationPage

Optional

string

A custom css styling of the event page

customSettings.hideSeatmapInCheckout

Optional

boolean

Hides the seatmap from the ticket buyer even if seating ticket types are available

customSettings.dontSendBookingConfirmationSMS

Optional

boolean

Whether a sms should be sent for booking confirmation

An array of extra fields of the event

extraFields\[\].\_id

Required

string

The ID of the extra field

extraFields\[\].required

Required

boolean

Whether the extra field is required

#### Optional Attributes

Expand all

extraFields\[\].name

Optional

string

The name of the extra field

extraFields\[\].description

Optional

string

The description of the extra field

extraFields\[\].collectInCheckout

Optional

boolean

Whether the extra field is collected in checkout

extraFields\[\].deleted

Optional

boolean

Whether the extra field is deleted

extraFields\[\].type

Optional

string

The type of the extra field. text = is a text field. number = is a number field. select = is a selection field of different selections. checkbox = is a checkbox field. tel = is a number field for a phone number. email = is a text field for an email. country = is a text field field for country.

`text``number``select``checkbox``tel``country``email``date``documentUpload``signature`

extraFields\[\].options

Optional

array<string>

An array of options of the extra field

extraFields\[\].onlyForCertainTicketTypes

Optional

boolean

Whether the extra field is only for certain ticket types

extraFields\[\].allowedTicketTypes

Optional

array<string>

An array of IDs of the ticket types allowed for the extra field

extraFields\[\].printable

Optional

boolean

Whether the extra field is printable

extraFields\[\].conditions

Optional

array

An array of conditions of the extra field. The conditions can refer to other extra fields.

extraFields\[\].conditions\[\].\_id

Required

string

The ID of the condition

extraFields\[\].conditions\[\].baseSlug

Required

string

The slug of the base extra field which the condition refers to

extraFields\[\].conditions\[\].value

Required

The value which the operator will be used on to check the condition.

One of

Only one of the following types

extraFields\[\].conditions\[\].operator

Required

string

The operator which will be used to check the condition

`equals``notEquals``greaterThan``lessThan``greaterThanOrEquals``lessThanOrEquals``exists``notExists`

ticketExtraFields

Optional

array

An array of extra fields for ticket types of the event

ticketExtraFields\[\].\_id

Required

string

The ID of the extra field

ticketExtraFields\[\].required

Required

boolean

Whether the extra field is required

#### Optional Attributes

Expand all

ticketExtraFields\[\].name

Optional

string

The name of the extra field

ticketExtraFields\[\].description

Optional

string

The description of the extra field

ticketExtraFields\[\].collectInCheckout

Optional

boolean

Whether the extra field is collected in checkout

ticketExtraFields\[\].deleted

Optional

boolean

Whether the extra field is deleted

ticketExtraFields\[\].type

Optional

string

The type of the extra field. text = is a text field. number = is a number field. select = is a selection field of different selections. checkbox = is a checkbox field. tel = is a number field for a phone number. email = is a text field for an email. country = is a text field field for country.

`text``number``select``checkbox``tel``country``email``date``documentUpload``signature`

ticketExtraFields\[\].options

Optional

array<string>

An array of options of the extra field

ticketExtraFields\[\].onlyForCertainTicketTypes

Optional

boolean

Whether the extra field is only for certain ticket types

ticketExtraFields\[\].allowedTicketTypes

Optional

array<string>

An array of IDs of the ticket types allowed for the extra field

ticketExtraFields\[\].printable

Optional

boolean

Whether the extra field is printable

ticketExtraFields\[\].conditions

Optional

array

An array of conditions of the extra field. The conditions can refer to other extra fields.

ticketExtraFields\[\].conditions\[\].\_id

Required

string

The ID of the condition

ticketExtraFields\[\].conditions\[\].baseSlug

Required

string

The slug of the base extra field which the condition refers to

ticketExtraFields\[\].conditions\[\].value

Required

The value which the operator will be used on to check the condition.

One of

Only one of the following types

ticketExtraFields\[\].conditions\[\].operator

Required

string

The operator which will be used to check the condition

`equals``notEquals``greaterThan``lessThan``greaterThanOrEquals``lessThanOrEquals``exists``notExists`

The accent color of the event page

The page style of the event page

Whether other events should be displayed on the event page

An array of under shops of the event

The ID of the under shop of the event

underShops\[\].name

Required

string

The name of the under shop of the event

underShops\[\].active

Required

boolean

Whether the under shop is active

#### Optional Attributes

Expand all

underShops\[\].tickets

Optional

array

An array of ticket types of the under shop

underShops\[\].tickets\[\].\_id

Required

string

The ID of ticket type extension of the event under shop

underShops\[\].tickets\[\].baseTicket

Required

string

The ID of a ticket type of the event used as base ticket type

underShops\[\].tickets\[\].name

Required

string

The name of the ticket type

underShops\[\].tickets\[\].price

Required

number float

The price of the ticket type

underShops\[\].tickets\[\].amount

Required

number float

The amount of the ticket type

underShops\[\].tickets\[\].active

Required

boolean

Whether the ticket type is active

#### Optional Attributes

Expand all

underShops\[\].tickets\[\].description

Optional

string

The description of the ticket type

underShops\[\].sellStart

Optional

string date-time

The sell start of the under shop. Optional for ROOT events only

underShops\[\].sellEnd

Optional

string date-time

The sell end of the under shop. Optional for ROOT events only

underShops\[\].maxAmount

Optional

number float

The maximum amount of tickets of the under shop

underShops\[\].maxAmountPerOrder

Optional

number float

The maximum amount per order of the under shop

underShops\[\].minAmountPerOrder

Optional

number float

The minimum amount per order of the under shop

underShops\[\].maxTransactionsPerCustomer

Optional

number float

The maximum amount of transactions per customer of the under shop

underShops\[\].maxAmountPerCustomer

Optional

number float

Maximum amount of tickets per customer of the event

underShops\[\].ticketShopHeaderText

Optional

string

The header of the ticket shop of the under shop

underShops\[\].customCharges

Optional

object

Custom charges of the under shop

underShops\[\].customCharges.\_id

Required

string

The ID of the custom charge

#### Optional Attributes

Expand all

underShops\[\].customCharges.outerChargeVar

Optional

number float

The variable outer charge of the custom charge

underShops\[\].customCharges.innerChargeVar

Optional

number float

The variable inner charge of the custom charge

underShops\[\].customCharges.outerChargeFix

Optional

number float

The fix outer charge of the custom charge

underShops\[\].customCharges.innerChargeFix

Optional

number float

The fix inner charge of the custom charge

underShops\[\].customCharges.posOuterChargeFix

Optional

number float

The fix POS outer charge of the custom charge

underShops\[\].customCharges.posOuterChargeVar

Optional

number float

The variable POS outer charge of the custom charge

underShops\[\].customCharges.cartOuterChargeFix

Optional

number float

The fix cart outer charge of the custom charge

underShops\[\].seatingContingents

Optional

array<string>

An array of seating contingents of the under shop

underShops\[\].availabilityMode

Optional

string

The availability mode of the shop

underShops\[\].bestAvailableSeatingConfiguration

Optional

object

The best available seating options of the under shop

#### Optional Attributes

Expand all

underShops\[\].bestAvailableSeatingConfiguration.enabled

Optional

boolean

Whether the best available seating is enabled

underShops\[\].bestAvailableSeatingConfiguration.enforced

Optional

boolean

Whether the best available seating is the only option to buy seated tickets. Seatmap won't be shown during checkout

underShops\[\].bestAvailableSeatingConfiguration.allowMassBooking

Optional

boolean

Whether the best available seating allows to buy seated tickets in bulk.

underShops\[\].reservationSettings

Optional

object

The reservation settings of the under shop

underShops\[\].reservationSettings.\_id

Required

string

The ID of the reservation setting

#### Optional Attributes

Expand all

underShops\[\].reservationSettings.option

Optional

string

The option of the reservation setting. reservationsOnly = needs reservation only. noReservations = no reservations needed. reservationsAndPayment = needs reservation and payment

`noReservations``reservationsOnly``reservationsAndPayment``internalReservationsAndPayment`

underShops\[\].reservationSettings.strategyId

Optional

string

The ID of the strategy of a purchase intents to be used on the event

underShops\[\].accountSettings

Optional

object

Account settings of the under shop

underShops\[\].accountSettings.\_id

Required

string

The ID of the account settings of the event

#### Optional Attributes

Expand all

underShops\[\].accountSettings.enforceAccounts

Optional

Deprecated

boolean

Whether to enforce accounts for the event

underShops\[\].accountSettings.enforceAuthentication

Optional

string

Whether to enforce authentication for the event and how to enforce it

`DISABLED``PREVENT_CHECKOUT``PREVENT_DETAILS_STEP`

underShops\[\].customerTags

Optional

array<string>

An array of customer tags of the under shop

underShops\[\].customerSegments

Optional

array<string>

An array of customer segments of the under shop

underShops\[\].allowMassDownload

Optional

boolean

Enables option to download bulk tickets as a CSV or PDF file.

underShops\[\].inventoryStrategy

Optional

string

Sets how available tickets will be calculated

`independent``subsidiary``global`

underShops\[\].extraFields

Optional

array

An array of extra fields of the under shop

underShops\[\].extraFields\[\].\_id

Required

string

The ID of the extra field

underShops\[\].extraFields\[\].required

Required

boolean

Whether the extra field is required

#### Optional Attributes

Expand all

underShops\[\].extraFields\[\].name

Optional

string

The name of the extra field

underShops\[\].extraFields\[\].description

Optional

string

The description of the extra field

underShops\[\].extraFields\[\].collectInCheckout

Optional

boolean

Whether the extra field is collected in checkout

underShops\[\].extraFields\[\].deleted

Optional

boolean

Whether the extra field is deleted

underShops\[\].extraFields\[\].type

Optional

string

The type of the extra field. text = is a text field. number = is a number field. select = is a selection field of different selections. checkbox = is a checkbox field. tel = is a number field for a phone number. email = is a text field for an email. country = is a text field field for country.

`text``number``select``checkbox``tel``country``email``date``documentUpload``signature`

underShops\[\].extraFields\[\].options

Optional

array<string>

An array of options of the extra field

underShops\[\].extraFields\[\].onlyForCertainTicketTypes

Optional

boolean

Whether the extra field is only for certain ticket types

underShops\[\].extraFields\[\].allowedTicketTypes

Optional

array<string>

An array of IDs of the ticket types allowed for the extra field

underShops\[\].extraFields\[\].printable

Optional

boolean

Whether the extra field is printable

underShops\[\].extraFields\[\].conditions

Optional

array

An array of conditions of the extra field. The conditions can refer to other extra fields.

underShops\[\].extraFields\[\].conditions\[\].\_id

Required

string

The ID of the condition

underShops\[\].extraFields\[\].conditions\[\].baseSlug

Required

string

The slug of the base extra field which the condition refers to

underShops\[\].extraFields\[\].conditions\[\].value

Required

The value which the operator will be used on to check the condition.

One of

Only one of the following types

underShops\[\].extraFields\[\].conditions\[\].operator

Required

string

The operator which will be used to check the condition

`equals``notEquals``greaterThan``lessThan``greaterThanOrEquals``lessThanOrEquals``exists``notExists`

underShops\[\].salesChannelGroupSettings

Optional

array

An array of sales channel group settings associated with the under shop

underShops\[\].salesChannelGroupSettings\[\].salesChannelGroupId

Required

string

The ID of the associated sales channel group

underShops\[\].paymentSettings

Optional

object

The payment settings of the event

#### Optional Attributes

Expand all

underShops\[\].paymentSettings.paymentStrategyId

Optional

string

The ID of the associated payment strategy

underShops\[\].unlockMode

Optional

string

Sets how event is locked, e.g. by coupon code.

Whether the seating is active

#### Optional Attributes

Expand all

The key of the event of the seating

The ID of the event of the seating

seating.seatMapId

Optional

string

The ID of the seat map of the event

seating.revisionId

Optional

string

The ID of the revision of the event

seating.orphanConfiguration

Optional

object

The orphan configuration of the seating

seating.orphanConfiguration.\_id

Required

string

The ID of the seating orphan configuration

#### Optional Attributes

Expand all

seating.orphanConfiguration.minSeatDistance

Optional

number float

Minimum distance of seats to each other

seating.orphanConfiguration.edgeSeatsOrphaning

Optional

boolean

Whether the edge seats can orphaning

seating.contingents

Optional

array<string>

An array of seating contingent ids

seating.availabilityMode

Optional

string

The seating availability mode

seating.bestAvailableSeatingConfiguration

Optional

object

The best available seating configuration of the seating

#### Optional Attributes

Expand all

seating.bestAvailableSeatingConfiguration.enabled

Optional

boolean

Whether the best available seating is enabled

seating.bestAvailableSeatingConfiguration.enforced

Optional

boolean

Whether the best available seating is the only option to buy seated tickets. Seatmap won't be shown during checkout

The custom text configuration of the event

customTextConfig.\_id

Required

string

The ID of the custom text configuration

#### Optional Attributes

Expand all

customTextConfig.buyTicketsCTA

Optional

string

The custom CTA after buy tickets

The type of the event. SINGLE = it is a single event. GROUP = the event is part of a group of events

`SINGLE``GROUP``RECURRENCE``ROOT`

An array of IDs of child events

An array of tags of the event

The search engine optimization settings of the event

The ID of the SEO setting

#### Optional Attributes

Expand all

An array of tags of the seo settings

seoSettings.noIndex

Optional

boolean

Whether the seo setting has no indexing

seoSettings.title

Optional

string

The title of the seo settings

seoSettings.description

Optional

string

The description of the seo settings

The extra information of the event

#### Optional Attributes

Expand all

extraInformation.\_id

Optional

string

The ID of the extra information of the event

extraInformation.type

Optional

string

The type of the extra information of the event

extraInformation.category

Optional

string

The category of the extra information of the event

extraInformation.subCategory

Optional

string

The subCategory of the extra information of the event

Custom charges of the event

customCharges.\_id

Required

string

The ID of the custom charge

#### Optional Attributes

Expand all

customCharges.outerChargeVar

Optional

number float

The variable outer charge of the custom charge

customCharges.innerChargeVar

Optional

number float

The variable inner charge of the custom charge

customCharges.outerChargeFix

Optional

number float

The fix outer charge of the custom charge

customCharges.innerChargeFix

Optional

number float

The fix inner charge of the custom charge

customCharges.posOuterChargeFix

Optional

number float

The fix POS outer charge of the custom charge

customCharges.posOuterChargeVar

Optional

number float

The variable POS outer charge of the custom charge

customCharges.cartOuterChargeFix

Optional

number float

The fix cart outer charge of the custom charge

An array of gallery items of the event

The ID of the gallery item

#### Optional Attributes

Expand all

The title of the gallery item

gallery\[\].description

Optional

string

The description of the gallery item

gallery\[\].copyright

Optional

string

The copyright of the gallery item

The index of the gallery item

The image of the gallery item

The video settings of the event

#### Optional Attributes

Expand all

The youtube video ID of the event video setting

The sold out fallback of the event

soldOutFallback.\_id

Required

string

The ID of sold out entry

#### Optional Attributes

Expand all

soldOutFallback.soldOutFallbackType

Optional

string

`default``moreinformation``waitinglist`

soldOutFallback.soldOutFallbackLink

Optional

string

The link of the sold out fallback

The ticket design settings for ticket types of the event

The ID of the ticket types design of the event

#### Optional Attributes

Expand all

ticketDesign.useCustomDesign

Optional

boolean

Whether to use custom design on ticket types of event

ticketDesign.customDesignURL

Optional

string

The custom design URL for ticket types of event

ticketDesign.footerDesignURL

Optional

string

The footer design URL for ticket types of the event

ticketDesign.disclaimer

Optional

string

The disclaimer for ticket types of the event

ticketDesign.infoColor

Optional

string

The info color for ticket types of the event

ticketDesign.showTimeRange

Optional

boolean

Whether to show time range on ticket types of the event

ticketDesign.hideDates

Optional

boolean

Whether to hide dates on ticket types of the event

ticketDesign.hideTimes

Optional

boolean

Whether to hide the time on ticket types of the event

checkinInformation

Optional

object

The checkin information of the event

checkinInformation.\_id

Required

string

The ID of the checkin information of the event

#### Optional Attributes

Expand all

checkinInformation.checkinStarts

Optional

string date-time

The date of when the checkin of the event starts

The tracking of the event

#### Optional Attributes

Expand all

tracking.facebookPixel

Optional

object

The facebook pixel information of the event tracking

#### Optional Attributes

Expand all

tracking.facebookPixel.active

Optional

boolean

Whether facebook pixel of event tracking is active

tracking.facebookPixel.pixelId

Optional

string

The ID of facebook pixel of the event tracking

The tagging of the event tracking

#### Optional Attributes

Expand all

tracking.tagging.enabled

Optional

boolean

Whether tagging of event tracking is enabled

tracking.tagging.tags

Optional

array<string>

An array of tags of the event tracking

hardTicketSettings

Optional

object

The hard ticket settings of the event

hardTicketSettings.\_id

Required

string

The ID of the event hard ticket settings

#### Optional Attributes

Expand all

hardTicketSettings.enabled

Optional

boolean

Whether hard tickets can be bought for this event

hardTicketSettings.fulfillmentType

Optional

string

The type of fulfillment. self fulfilled by the seller. managed fulfilled by vivenu.

hardTicketSettings.printingMethod

Optional

string

Which printing method is used. preprinted = The tickets are preprinted. adhoc = The tickets are printed ad-hoc.

hardTicketSettings.hardTicketOuterCharge

Optional

number float

Additional charge for every hard ticket that is added to the ticket price and the other outer charges - paid by the ticket buyer.

hardTicketSettings.hardTicketInnerCharge

Optional

number float

Additional charge for hard tickets as in the contract of the seller

hardTicketSettings.hardTicketPreviewURL

Optional

string

The hard ticket design image

hardTicketSettings.promotionName

Optional

string

A special name for hard tickets. e.g. "Collector edition"

hardTicketSettings.promotionText

Optional

string

A description about what makes this ticket so special

hardTicketSettings.requiredDays

Optional

integer

Required days until deliver of the hard tickets

dataRequestSettings

Optional

object

The data request settings of the event

dataRequestSettings.\_id

Required

string

The ID of the data request settings of the event

#### Optional Attributes

Expand all

dataRequestSettings.requiresPersonalization

Optional

boolean

Whether the tickets for this event need personalization

dataRequestSettings.requiresExtraFields

Optional

boolean

Whether the tickets for this event need extra data fields

dataRequestSettings.repersonalization

Optional

Deprecated

boolean

Whether the tickets can be re personalized.

dataRequestSettings.repersonalizationAllowed

Optional

boolean

Whether the tickets can be re personalized.

dataRequestSettings.repersonalizationEndDate

Optional

Deprecated

string date-time

If repersonalization = true. Until when the re personalization is allowed.

dataRequestSettings.repersonalizationDeadline

Optional

object

If repersonalization = true. A relatve date specification until when the re personalization is allowed.

dataRequestSettings.repersonalizationDeadline.unit

Required

string

The unit in which the offset is specified

dataRequestSettings.repersonalizationDeadline.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

dataRequestSettings.repersonalizationDeadline.target

Optional

string

The target of the relative date

dataRequestSettings.repersonalizationFee

Optional

number float

If repersonalization = true. The per-ticket fee for repersonalization.

dataRequestSettings.repersonalizationsLimit

Optional

number float

If repersonalization = true. The number of times repersonalization is allowed.

dataRequestSettings.posPersonalization

Optional

string

The type of personalization for this event on Point of Sale applications.

`noPersonalization``optionalPersonalization``requiredPersonalization`

dataRequestSettings.skipAddressInfo

Optional

boolean

Whether the checkout should not ask for the address of the ticket buyer.

dataRequestSettings.enforceCompany

Optional

boolean

Whether the company of the ticket buyer is a required field.

Style options of the event page

#### Optional Attributes

Expand all

styleOptions.headerStyle

Optional

string

Header style of the event page

styleOptions.brandOne

Optional

string

First brand of the event

styleOptions.brandTwo

Optional

string

Second brand of the event

styleOptions.hideLocationMap

Optional

boolean

Whether the location map on the event page hide

styleOptions.hideLocationAddress

Optional

boolean

Whether the location address on the event page hide

styleOptions.categoryAlignment

Optional

number float

The style of category alignment. 0 = cascade = categories among themselves. 1 = asTabs = categories as tabs. 2 = boxes = categories as boxes

styleOptions.showAvailabilityIndicator

Optional

boolean

Whether the availability indicator on the event page should be shown

styleOptions.availabilityIndicatorThresholds

Optional

array<number>

The availability indicator thresholds of the event

styleOptions.showAvailable

Optional

boolean

Whether to show availability of the time slot. Only applicable for time slot events.

The geographic code of the event

Latitude coordinate of the geo code

Longitude coordinate of the geo code

Account settings of the event

accountSettings.\_id

Required

string

The ID of the account settings of the event

#### Optional Attributes

Expand all

accountSettings.enforceAccounts

Optional

Deprecated

boolean

Whether to enforce accounts for the event

accountSettings.enforceAuthentication

Optional

string

Whether to enforce authentication for the event and how to enforce it

`DISABLED``PREVENT_CHECKOUT``PREVENT_DETAILS_STEP`

reservationSettings

Optional

object

The reservation settings of event

reservationSettings.\_id

Required

string

The ID of the reservation setting

#### Optional Attributes

Expand all

reservationSettings.option

Optional

string

The option of the reservation setting. reservationsOnly = needs reservation only. noReservations = no reservations needed. reservationsAndPayment = needs reservation and payment

`noReservations``reservationsOnly``reservationsAndPayment``internalReservationsAndPayment`

reservationSettings.strategyId

Optional

string

The ID of the strategy of a purchase intents to be used on the event

The upsell settings of the event

upsellSettings.\_id

Required

string

The ID of the upsell settings of the event

#### Optional Attributes

Expand all

upsellSettings.active

Optional

boolean

Whether upselling is active on the event

upsellSettings.productStream

Optional

string

The product stream for upselling

upsellSettings.headerImage

Optional

string

A header image for the ticket shop, when selecting products

upsellSettings.crossSells

Optional

object

The cross selling settings.

#### Optional Attributes

Expand all

upsellSettings.crossSells.eventIds

Optional

array<string>

The array of the promoted event IDs.

repetitionSettings

Optional

array

The repetition settings of the event

repetitionSettings\[\].every

Required

number float

Repeat event every unit of time

repetitionSettings\[\].unit

Required

string

Unit of repetition - day, week, month

repetitionSettings\[\].from

Required

string date-time

Repeat event from date

repetitionSettings\[\].to

Required

string date-time

Repeat event till date

#### Optional Attributes

Expand all

repetitionSettings\[\].repeatsOn

Optional

array<string>

Days of a week when the event is repeated

The possible day schemas of how event could be sold

The ID of the day scheme assigned to the event.

The event ticket settings

#### Optional Attributes

Expand all

ticketSettings.cancellationStrategy

Optional

string

Cancellation strategy of the ticket types

ticketSettings.transferSettings

Optional

object

Transfer settings of the ticket types

#### Optional Attributes

Expand all

ticketSettings.transferSettings.mode

Optional

string

Ticket transfer mode.

ticketSettings.transferSettings.expiresAfter

Optional

object

If 'mode = ALLOWED'. A relatve date specification until when ticket transfer is valid.

ticketSettings.transferSettings.expiresAfter.unit

Required

string

The unit in which the offset is specified

ticketSettings.transferSettings.expiresAfter.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.transferSettings.expiresAfter.target

Optional

string

The target of the relative date

ticketSettings.transferSettings.retransferMode

Optional

string

Ticket retransfer mode.

ticketSettings.transferSettings.allowedUntil

Optional

object

If 'mode = ALLOWED'. A relatve date specification until the end of the event where ticket transfer is possible.

ticketSettings.transferSettings.allowedUntil.unit

Required

string

The unit in which the offset is specified

ticketSettings.transferSettings.allowedUntil.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.transferSettings.allowedUntil.target

Optional

string

The target of the relative date

ticketSettings.transferSettings.hardTicketsMode

Optional

string

If 'hardTicketsMode = ALLOWED' then hard tickets transfers allowed.

ticketSettings.upgradeSettings

Optional

object

Upgrade settings of the ticket types

#### Optional Attributes

Expand all

ticketSettings.upgradeSettings.enabled

Optional

string

Whether ticket upgrade settings enabled.

ticketSettings.upgradeSettings.underShopMapping

Optional

array

Mapping to define the under shop in which a ticket upgrade will be performed.

ticketSettings.upgradeSettings.underShopMapping\[\].type

Required

string

ticketSettings.upgradeSettings.underShopMapping\[\].tag

Required

string

The customer tag

ticketSettings.upgradeSettings.underShopMapping\[\].underShopId

Required

string

The ID of the under shop.

ticketSettings.resellSettings

Optional

object

Resell settings

#### Optional Attributes

Expand all

ticketSettings.resellSettings.enabled

Optional

string

Whether resell is enabled

ticketSettings.resellSettings.resellerFeeFix

Optional

number float

The fix resellers fee.

ticketSettings.resellSettings.resellerFeeVar

Optional

number float

The variable resellers fee.

ticketSettings.resellSettings.offerCreationStart

Optional

object

A relative date specification of offers creation start.

ticketSettings.resellSettings.offerCreationStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationStart.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.offerCreationEnd

Optional

object

A relative date specification of offers creation end.

ticketSettings.resellSettings.offerCreationEnd.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationEnd.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationEnd.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.salesStart

Optional

object

A relative date specification of sales start.

ticketSettings.resellSettings.salesStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.salesStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.salesStart.target

Optional

string

The target of the relative date

ticketSettings.barcodeSettings

Optional

object

Barcode settings

#### Optional Attributes

Expand all

ticketSettings.barcodeSettings.issueOfflineBarcodes

Optional

string

Whether offline barcodes are enabled

ticketSettings.childEventMapping

Optional

array

Child event mapping

ticketSettings.childEventMapping\[\].childEventId

Required

string

The child event for this mapping

ticketSettings.childEventMapping\[\].ticketTypeMapping

Required

object

Mapping between ticket types of the parent event and the child events

#### Optional Attributes

Expand all

ticketSettings.childEventMapping\[\].valueShare

Optional

number float

The percentage value of this child event from the value of the parent event

ticketSettings.seasonCardValueStrategy

Optional

string

The strategy used to determine the value of a child event in the context of the parent event

`childValue``averagePerChild``sharePerChild`

accessListMapping

Optional

array

The array represents a mapping between access list ids and ticket type ids for which a ticket will be created.

accessListMapping\[\].listId

Required

string

The ID of the access list.

accessListMapping\[\].ticketTypeId

Required

string

The ID of the ticket type.

#### Optional Attributes

Expand all

deliverySettings.wallet

Optional

object

#### Optional Attributes

Expand all

deliverySettings.wallet.enabled

Optional

string

deliverySettings.wallet.nfc

Optional

string

deliverySettings.wallet.seasonCardShowNextEvent

Optional

boolean

Whether to display the information for next event of the season event on a wallet ticket or not. If activated, the information of the next event will be displayed on the wallet ticket instead of the season event.

deliverySettings.pdf

Optional

object

#### Optional Attributes

Expand all

deliverySettings.pdf.enabled

Optional

string

Custom key-value data. Metadata is useful for storing additional, structured information on an object.

salesChannelGroupSettings

Optional

array

An array of sales channel group settings associated with the event

salesChannelGroupSettings\[\].salesChannelGroupId

Required

string

The ID of the associated sales channel group

The payment settings of the event

#### Optional Attributes

Expand all

paymentSettings.paymentStrategyId

Optional

string

The ID of the associated payment strategy

The time slots for the event

timeSlots\[\].startTime

Required

object

The time of day the time slot starts

timeSlots\[\].startTime.hour

Required

integer

timeSlots\[\].startTime.minute

Required

integer

The ticket references for the time slot

timeSlots\[\].refs\[\].refType

Required

string

The type of the reference

timeSlots\[\].refs\[\].categoryRef

Required

string

The ticket category reference to use for the time slot

#### Optional Attributes

Expand all

timeSlots\[\].amount

Optional

number float

The amount of available tickets of the time slot of the event

Whether the event uses time slots.

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```

## [Create an Event](https://docs.vivenu.dev/tickets#create-an-event)

#### Payload

#### Optional Attributes

Expand all

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

#### Optional Attributes

Expand all

pricingSettings.priceTableId

Optional

string

pricingSettings.priceTableTierId

Optional

string

pricingSettings.dynamicPricing

Optional

object

#### Optional Attributes

Expand all

pricingSettings.dynamicPricing.enabled

Optional

boolean

#### Optional Attributes

Expand all

taxSettings.defaultTicketTaxServiceTypeId

Optional

string

rebookingSettings

Optional

object

#### Optional Attributes

Expand all

rebookingSettings.rebookingStrategyId

Optional

string

maxAmountPerOrder

Optional

number float

maxAmountPerCustomer

Optional

number float

maxTransactionsPerCustomer

Optional

number float

minAmountPerOrder

Optional

number float

One of

Only one of the following types

ticketExtraFields

Optional

array

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

checkinInformation

Optional

object

hardTicketSettings

Optional

object

documentTemplateSettings

Optional

object

dataRequestSettings

Optional

object

The time slots for the event

timeSlots\[\].startTime

Required

object

The time of day the time slot starts

timeSlots\[\].startTime.hour

Required

integer

timeSlots\[\].startTime.minute

Required

integer

The ticket references for the time slot

timeSlots\[\].refs\[\].refType

Required

string

The type of the reference

timeSlots\[\].refs\[\].categoryRef

Required

string

The ticket category reference to use for the time slot

#### Optional Attributes

Expand all

timeSlots\[\].amount

Optional

number float

The amount of available tickets of the time slot of the event

#### Optional Attributes

Expand all

ticketSettings.upgradeSettings

Optional

object

Upgrade settings of the ticket types

#### Optional Attributes

Expand all

ticketSettings.upgradeSettings.enabled

Optional

string

Whether ticket upgrade settings enabled.

ticketSettings.upgradeSettings.underShopMapping

Optional

array

Mapping to define the under shop in which a ticket upgrade will be performed.

ticketSettings.upgradeSettings.underShopMapping\[\].type

Required

string

ticketSettings.upgradeSettings.underShopMapping\[\].tag

Required

string

The customer tag

ticketSettings.upgradeSettings.underShopMapping\[\].underShopId

Required

string

The ID of the under shop.

ticketSettings.resellSettings

Optional

object

Resell settings

#### Optional Attributes

Expand all

ticketSettings.resellSettings.enabled

Optional

string

Whether resell is enabled

ticketSettings.resellSettings.resellerFeeFix

Optional

number float

The fix resellers fee.

ticketSettings.resellSettings.resellerFeeVar

Optional

number float

The variable resellers fee.

ticketSettings.resellSettings.offerCreationStart

Optional

object

A relative date specification of offers creation start.

ticketSettings.resellSettings.offerCreationStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationStart.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.offerCreationEnd

Optional

object

A relative date specification of offers creation end.

ticketSettings.resellSettings.offerCreationEnd.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationEnd.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationEnd.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.salesStart

Optional

object

A relative date specification of sales start.

ticketSettings.resellSettings.salesStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.salesStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.salesStart.target

Optional

string

The target of the relative date

Custom key-value data. Metadata is useful for storing additional, structured information on an object.

Was this section helpful?

YesNo

```
{  "name": "string",  "description": "string",  "slogan": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "groups": [    "string"  ],  "discountGroups": [    "string"  ],  "posDiscounts": [    "string"  ],  "categories": [    "string"  ],  "tickets": [    "string"  ],  "image": "string",  "ticketFooter": "string",  "ticketShopHeader": "string",  "start": [],  "end": [],  "timezone": "string",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "pricingSettings": {    "priceTableId": "string",    "priceTableTierId": "string",    "dynamicPricing": {      "enabled": true    }  },  "taxSettings": {    "defaultTicketTaxServiceTypeId": "string"  },  "rebookingSettings": {    "rebookingStrategyId": "string"  },  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 10.5,  "customerTags": [    "string"  ],  "customerSegments": [    "string"  ],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    "string"  ],  "ticketExtraFields": [    "string"  ],  "accentColor": "string",  "pageStyle": "string",  "showOtherEvents": true,  "underShops": [    "string"  ],  "seating": {},  "eventType": "string",  "extraInformation": {},  "customCharges": {},  "gallery": [    "string"  ],  "video": {},  "ticketDesign": {},  "checkinInformation": {},  "tracking": {},  "hardTicketSettings": {},  "customTextConfig": {},  "documentTemplateSettings": {},  "dataRequestSettings": {},  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "ticketSettings": {    "upgradeSettings": {      "enabled": "ENABLED",      "underShopMapping": [        {          "type": "tag",          "tag": "string",          "underShopId": "string"        }      ]    },    "resellSettings": {      "enabled": "ENABLED",      "resellerFeeFix": 10.5,      "resellerFeeVar": 10.5,      "offerCreationStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "offerCreationEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      }    }  },  "meta": {},  "attributes": {}}
```

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```

## [Get an Event](https://docs.vivenu.dev/tickets#get-an-event)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```

## [Update an Event](https://docs.vivenu.dev/tickets#update-an-event)

#### Payload

#### Optional Attributes

Expand all

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

#### Optional Attributes

Expand all

tickets\[\].barcodePrefix

Optional

string

#### Optional Attributes

Expand all

pricingSettings.priceTableId

Optional

string

pricingSettings.priceTableTierId

Optional

string

pricingSettings.dynamicPricing

Optional

object

#### Optional Attributes

Expand all

pricingSettings.dynamicPricing.enabled

Optional

boolean

#### Optional Attributes

Expand all

taxSettings.defaultTicketTaxServiceTypeId

Optional

string

maxAmountPerOrder

Optional

number float

maxAmountPerCustomer

Optional

number float

maxTransactionsPerCustomer

Optional

number float

minAmountPerOrder

Optional

number float

One of

Only one of the following types

ticketExtraFields

Optional

array

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

checkinInformation

Optional

object

hardTicketSettings

Optional

object

documentTemplateSettings

Optional

object

#### Optional Attributes

Expand all

The ID of the day scheme.

daySchemes\[\].name

Optional

string

The name of the day scheme.

daySchemes\[\].color

Optional

string

The color of the day scheme.

daySchemes\[\].offers

Optional

object

Offers of the day scheme.

#### Optional Attributes

Expand all

daySchemes\[\].offers.allTicketTypesActive

Optional

boolean

Whether the all ticket types active.

daySchemes\[\].offers.ticketTypes

Optional

array

The day scheme offer ticket types.

daySchemes\[\].offers.ticketTypes\[\].ticketTypeId

Required

string

The ticket type id which could be sold.

#### Optional Attributes

Expand all

daySchemes\[\].offers.ticketTypes\[\].active

Optional

boolean

Whether the ticket type is selling.

daySchemes\[\].offers.timeSlots

Optional

array

Time slots overrides.

daySchemes\[\].offers.timeSlots\[\].slotId

Required

string

The slotId of the time slot.

#### Optional Attributes

Expand all

daySchemes\[\].offers.timeSlots\[\].enabled

Optional

string

Whether the slot is enabled.

daySchemes\[\].offers.timeSlots\[\].amount

Optional

number float

The amount of available tickets of the time slot of the day scheme.

subscriptionSettings

Optional

object

accessListMapping

Optional

array

One of

Only one of the following types

#### Optional Attributes

Expand all

deliverySettings.wallet

Optional

object

#### Optional Attributes

Expand all

deliverySettings.wallet.enabled

Optional

string

deliverySettings.wallet.nfc

Optional

string

deliverySettings.wallet.seasonCardShowNextEvent

Optional

boolean

Whether to display the information for next event of the season event on a wallet ticket or not. If activated, the information of the next event will be displayed on the wallet ticket instead of the season event.

deliverySettings.pdf

Optional

object

#### Optional Attributes

Expand all

deliverySettings.pdf.enabled

Optional

string

dataRequestSettings

Optional

object

salesChannelGroupSettings

Optional

array

An array of sales channel group settings associated with the event

salesChannelGroupSettings\[\].salesChannelGroupId

Required

string

The ID of the associated sales channel group

The payment settings of the event

#### Optional Attributes

Expand all

paymentSettings.paymentStrategyId

Optional

string

The ID of the associated payment strategy

The time slots for the event

timeSlots\[\].startTime

Required

object

The time of day the time slot starts

timeSlots\[\].startTime.hour

Required

integer

timeSlots\[\].startTime.minute

Required

integer

The ticket references for the time slot

timeSlots\[\].refs\[\].refType

Required

string

The type of the reference

timeSlots\[\].refs\[\].categoryRef

Required

string

The ticket category reference to use for the time slot

#### Optional Attributes

Expand all

timeSlots\[\].amount

Optional

number float

The amount of available tickets of the time slot of the event

#### Optional Attributes

Expand all

ticketSettings.upgradeSettings

Optional

object

Upgrade settings of the ticket types

#### Optional Attributes

Expand all

ticketSettings.upgradeSettings.enabled

Optional

string

Whether ticket upgrade settings enabled.

ticketSettings.upgradeSettings.underShopMapping

Optional

array

Mapping to define the under shop in which a ticket upgrade will be performed.

ticketSettings.upgradeSettings.underShopMapping\[\].type

Required

string

ticketSettings.upgradeSettings.underShopMapping\[\].tag

Required

string

The customer tag

ticketSettings.upgradeSettings.underShopMapping\[\].underShopId

Required

string

The ID of the under shop.

ticketSettings.childEventMapping

Optional

array

Child event mapping

ticketSettings.childEventMapping\[\].childEventId

Required

string

The child event for this mapping

ticketSettings.childEventMapping\[\].ticketTypeMapping

Required

object

Mapping between ticket types of the parent event and the child events

#### Optional Attributes

Expand all

ticketSettings.childEventMapping\[\].valueShare

Optional

number float

The percentage value of this child event from the value of the parent event

ticketSettings.seasonCardValueStrategy

Optional

string

The strategy used to determine the value of a child event in the context of the parent event

`childValue``averagePerChild``sharePerChild`

ticketSettings.resellSettings

Optional

object

Resell settings

#### Optional Attributes

Expand all

ticketSettings.resellSettings.enabled

Optional

string

Whether resell is enabled

ticketSettings.resellSettings.resellerFeeFix

Optional

number float

The fix resellers fee.

ticketSettings.resellSettings.resellerFeeVar

Optional

number float

The variable resellers fee.

ticketSettings.resellSettings.offerCreationStart

Optional

object

A relative date specification of offers creation start.

ticketSettings.resellSettings.offerCreationStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationStart.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.offerCreationEnd

Optional

object

A relative date specification of offers creation end.

ticketSettings.resellSettings.offerCreationEnd.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationEnd.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationEnd.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.salesStart

Optional

object

A relative date specification of sales start.

ticketSettings.resellSettings.salesStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.salesStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.salesStart.target

Optional

string

The target of the relative date

Custom key-value data. Metadata is useful for storing additional, structured information on an object.

Was this section helpful?

YesNo

```
{  "name": "string",  "description": "string",  "slogan": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "groups": [    "string"  ],  "discountGroups": [    "string"  ],  "posDiscounts": [    "string"  ],  "rules": [    "string"  ],  "categories": [    "string"  ],  "tickets": [    {      "barcodePrefix": "string"    }  ],  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "timezone": "string",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "pricingSettings": {    "priceTableId": "string",    "priceTableTierId": "string",    "dynamicPricing": {      "enabled": true    }  },  "taxSettings": {    "defaultTicketTaxServiceTypeId": "string"  },  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 10.5,  "customerTags": [    "string"  ],  "customerSegments": [    "string"  ],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    "string"  ],  "ticketExtraFields": [    "string"  ],  "accentColor": "string",  "pageStyle": "string",  "showOtherEvents": true,  "underShops": [    "string"  ],  "seating": {},  "eventType": "string",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {},  "extraInformation": {},  "customCharges": {},  "gallery": [    "string"  ],  "video": {},  "ticketDesign": {},  "checkinInformation": {},  "tracking": {},  "hardTicketSettings": {},  "customTextConfig": {},  "upsellSettings": {},  "documentTemplateSettings": {},  "daySchemes": [],  "daySchemeId": "string",  "feeSettings": {},  "subscriptionSettings": {},  "accessListMapping": [    "string"  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "dataRequestSettings": {},  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "ticketSettings": {    "upgradeSettings": {      "enabled": "ENABLED",      "underShopMapping": [        {          "type": "tag",          "tag": "string",          "underShopId": "string"        }      ]    },    "childEventMapping": [      {        "childEventId": "string",        "ticketTypeMapping": {},        "valueShare": 10.5      }    ],    "seasonCardValueStrategy": "childValue",    "resellSettings": {      "enabled": "ENABLED",      "resellerFeeFix": 10.5,      "resellerFeeVar": 10.5,      "offerCreationStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "offerCreationEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      }    }  },  "meta": {},  "attributes": {}}
```

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```

## [Delete an Event](https://docs.vivenu.dev/tickets#delete-an-event)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```

## [Duplicate an Event](https://docs.vivenu.dev/tickets#duplicate-an-event)

#### Payload

One of

Only one of the following types

#### Optional Attributes

Expand all

duplicateContingents

Optional

boolean

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

Was this section helpful?

YesNo

```
{  "_id": "string",  "eventType": "ROOT",  "image": "string",  "name": "string",  "duplicateContingents": true,  "revisionId": "string",  "seatMapId": "string",  "start": [],  "end": [],  "sellStart": [],  "sellEnd": []}
```

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```

```
{  "seatMapId": "string",  "revisionId": "string"}
```

## [Get all Events](https://docs.vivenu.dev/tickets#get-all-events)

#### Query

One of

Only one of the following types

One of

Only one of the following types

#### Optional Attributes

Expand all

value is greater than or equal

value is less than or equal

#### Optional Attributes

Expand all

value is greater than or equal

value is less than or equal

A limit on the number of objects to be returned. Can range between 1 and 1000.

The number of objects to skip for the requested result

Was this section helpful?

YesNo

```
{  "rows": [    {      "_id": "string",      "sellerId": "string",      "name": "string",      "slogan": "string",      "description": "string",      "locationName": "string",      "locationStreet": "string",      "locationCity": "string",      "locationPostal": "string",      "locationCountry": "string",      "image": "string",      "ticketFooter": "string",      "ticketBackground": "string",      "ticketShopHeader": "string",      "groups": [        {          "_id": "string",          "name": "string",          "tickets": [            "string"          ]        }      ],      "discountGroups": [        {          "_id": "string",          "name": "string",          "rules": [            {              "_id": "string",              "group": "string",              "type": "ticketGroups",              "min": 10.5,              "max": 10.5            }          ],          "discountType": "fix",          "value": 10.5        }      ],      "cartAutomationRules": [        {          "_id": "string",          "name": "string",          "triggerType": "hasBeenAdded",          "triggerTargetGroup": "string",          "thenType": "autoAdd",          "thenTargets": [            {              "_id": "string",              "thenTargetGroup": "string",              "thenTargetMin": 10.5,              "thenTargetMax": 10.5            }          ]        }      ],      "posDiscounts": [        {          "_id": "string",          "name": "string",          "discountType": "fix",          "value": 10.5        }      ],      "categories": [        {          "_id": "string",          "name": "string",          "description": "string",          "seatingReference": "string",          "ref": "string",          "amount": 10.5,          "recommendedTicket": "string",          "maxAmountPerOrder": 10.5,          "listWithoutSeats": true        }      ],      "tickets": [        {          "_id": "string",          "name": "string",          "description": "string",          "image": "string",          "color": "string",          "price": 10.5,          "amount": 10.5,          "active": true,          "posActive": true,          "categoryRef": "string",          "ignoredForStartingPrice": true,          "conditionalAvailability": true,          "ticketBackground": "string",          "rules": [            {              "_id": "string",              "ticketGroup": "string",              "min": 10.5,              "max": 10.5            }          ],          "requiresPersonalization": true,          "requiresPersonalizationMode": "ENABLED",          "requiresExtraFields": true,          "requiresExtraFieldsMode": "ENABLED",          "repersonalizationFee": 10.5,          "sortingKey": 10.5,          "enableHardTicketOption": true,          "forceHardTicketOption": true,          "maxAmountPerOrder": 10.5,          "minAmountPerOrder": 10.5,          "minAmountPerOrderRule": 10.5,          "taxRate": 10.5,          "styleOptions": {},          "priceCategoryId": "string",          "entryPermissions": [],          "ignoreForMaxAmounts": true,          "expirationSettings": {},          "barcodePrefix": "string",          "salesStart": {            "target": "string",            "unit": "hours",            "offset": 1          },          "salesEnd": {            "target": "string",            "unit": "hours",            "offset": 1          },          "transferSettings": {},          "scanSettings": {            "feedback": "highlight"          },          "deliverySettings": {            "wallet": {              "enabled": "ENABLED"            },            "pdf": {              "enabled": "ENABLED"            }          },          "meta": {}        }      ],      "createdAt": "2030-01-23T23:00:00.123Z",      "updatedAt": "2030-01-23T23:00:00.123Z",      "start": "2030-01-23T23:00:00.123Z",      "end": "2030-01-23T23:00:00.123Z",      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "maxAmountPerCustomer": 10.5,      "maxTransactionsPerCustomer": 10.5,      "minAmountPerOrder": 1,      "customerTags": [],      "customerSegments": [],      "showCountdown": true,      "hideInListing": true,      "visibleAfter": "2030-01-23T23:00:00.123Z",      "customSettings": {},      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "ticketExtraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "accentColor": "#006DCC",      "pageStyle": "white",      "showOtherEvents": true,      "underShops": [        {          "_id": "string",          "name": "string",          "active": true,          "tickets": [            {              "_id": "string",              "baseTicket": "string",              "name": "string",              "description": "string",              "price": 10.5,              "amount": 10.5,              "active": true            }          ],          "sellStart": "2030-01-23T23:00:00.123Z",          "sellEnd": "2030-01-23T23:00:00.123Z",          "maxAmount": 10.5,          "maxAmountPerOrder": 10.5,          "minAmountPerOrder": 1,          "maxTransactionsPerCustomer": 10.5,          "maxAmountPerCustomer": 10.5,          "ticketShopHeaderText": "string",          "customCharges": {},          "seatingContingents": [            "string"          ],          "availabilityMode": "default",          "bestAvailableSeatingConfiguration": {            "enabled": true,            "enforced": true,            "allowMassBooking": true          },          "reservationSettings": {            "option": "noReservations"          },          "accountSettings": {            "_id": "string",            "enforceAccounts": true,            "enforceAuthentication": "DISABLED"          },          "customerTags": [],          "customerSegments": [],          "allowMassDownload": true,          "inventoryStrategy": "independent",          "extraFields": [            {              "_id": "string",              "name": "string",              "description": "string",              "required": true,              "collectInCheckout": true,              "deleted": true,              "type": "text",              "options": [                "string"              ],              "onlyForCertainTicketTypes": true,              "allowedTicketTypes": [],              "printable": true,              "conditions": [                {                  "_id": "string",                  "baseSlug": "string",                  "value": [],                  "operator": "equals"                }              ]            }          ],          "salesChannelGroupSettings": [            {              "salesChannelGroupId": "string"            }          ],          "paymentSettings": {            "paymentStrategyId": "string"          },          "unlockMode": "none"        }      ],      "seating": {        "_id": "string",        "active": true,        "eventKey": "string",        "eventId": "string",        "seatMapId": "string",        "revisionId": "string",        "orphanConfiguration": {          "_id": "string",          "minSeatDistance": 2,          "edgeSeatsOrphaning": true        },        "contingents": [          "string"        ],        "availabilityMode": "default",        "bestAvailableSeatingConfiguration": {          "enabled": true,          "enforced": true        }      },      "customTextConfig": {        "_id": "string",        "buyTicketsCTA": "string"      },      "eventType": "SINGLE",      "childEvents": [        "string"      ],      "url": "string",      "tags": [        "string"      ],      "seoSettings": {        "_id": "string",        "tags": [          "string"        ],        "noIndex": true,        "title": "string",        "description": "string"      },      "extraInformation": {        "_id": "string",        "type": "string",        "category": "string",        "subCategory": "string"      },      "customCharges": {        "_id": "string",        "outerChargeVar": 10.5,        "innerChargeVar": 10.5,        "outerChargeFix": 10.5,        "innerChargeFix": 10.5,        "posOuterChargeFix": 10.5,        "posOuterChargeVar": 10.5,        "cartOuterChargeFix": 10.5      },      "gallery": [        {          "_id": "string",          "title": "string",          "description": "string",          "copyright": "string",          "index": 10.5,          "image": "string"        }      ],      "video": {        "youtubeID": "string"      },      "soldOutFallback": {        "_id": "string",        "soldOutFallbackType": "default",        "soldOutFallbackLink": "string"      },      "ticketDesign": {        "_id": "string",        "useCustomDesign": true,        "customDesignURL": "string",        "footerDesignURL": "string",        "disclaimer": "string",        "infoColor": "string",        "showTimeRange": true,        "hideDates": true,        "hideTimes": true      },      "checkinInformation": {        "_id": "string",        "checkinStarts": "2030-01-23T23:00:00.123Z"      },      "tracking": {        "facebookPixel": {          "active": true,          "pixelId": "string"        },        "tagging": {          "enabled": true,          "tags": [            "string"          ]        }      },      "hardTicketSettings": {        "_id": "string",        "enabled": true,        "fulfillmentType": "self",        "printingMethod": "preprinted",        "hardTicketOuterCharge": 10.5,        "hardTicketInnerCharge": 10.5,        "hardTicketPreviewURL": "string",        "promotionName": "string",        "promotionText": "string",        "requiredDays": 1      },      "dataRequestSettings": {        "requiresPersonalization": false,        "requiresExtraFields": false,        "repersonalization": false,        "posPersonalization": "noPersonalization"      },      "styleOptions": {        "headerStyle": "default",        "hideLocationMap": false,        "hideLocationAddress": false,        "categoryAlignment": 0,        "showAvailabilityIndicator": false,        "availabilityIndicatorThresholds": [          0.3,          0.7        ]      },      "geoCode": {        "_id": "string",        "lat": 10.5,        "lng": 10.5      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "reservationSettings": {        "option": "noReservations"      },      "upsellSettings": {        "_id": "string",        "active": true,        "productStream": "string",        "headerImage": "string",        "crossSells": {          "eventIds": [            "string"          ]        }      },      "repetitionSettings": [        {          "every": 10.5,          "unit": "DAY",          "repeatsOn": [            "SUNDAY"          ],          "from": "2030-01-23T23:00:00.123Z",          "to": "2030-01-23T23:00:00.123Z"        }      ],      "rootId": "string",      "daySchemes": [        {          "_id": "string",          "name": "string",          "color": "string",          "offers": {}        }      ],      "daySchemeId": "string",      "ticketSettings": {},      "accessListMapping": [        {          "listId": "string",          "ticketTypeId": "string"        }      ],      "deliverySettings": {        "wallet": {          "enabled": "ENABLED",          "nfc": "ENABLED",          "seasonCardShowNextEvent": true        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {},      "timezone": "string",      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "timeSlots": [        {          "_id": "string",          "startTime": {            "hour": 1,            "minute": 1          },          "refs": [            {              "refType": "category",              "categoryRef": "string"            }          ],          "amount": 10.5        }      ],      "useTimeSlots": true,      "attributes": {}    }  ],  "total": 1}
```

## [Get Event parents](https://docs.vivenu.dev/tickets#get-event-parents)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
[  {    "_id": "string",    "sellerId": "string",    "name": "string",    "slogan": "string",    "description": "string",    "locationName": "string",    "locationStreet": "string",    "locationCity": "string",    "locationPostal": "string",    "locationCountry": "string",    "image": "string",    "ticketFooter": "string",    "ticketBackground": "string",    "ticketShopHeader": "string",    "groups": [      {        "_id": "string",        "name": "string",        "tickets": [          "string"        ]      }    ],    "discountGroups": [      {        "_id": "string",        "name": "string",        "rules": [          {            "_id": "string",            "group": "string",            "type": "ticketGroups",            "min": 10.5,            "max": 10.5          }        ],        "discountType": "fix",        "value": 10.5      }    ],    "cartAutomationRules": [      {        "_id": "string",        "name": "string",        "triggerType": "hasBeenAdded",        "triggerTargetGroup": "string",        "thenType": "autoAdd",        "thenTargets": [          {            "_id": "string",            "thenTargetGroup": "string",            "thenTargetMin": 10.5,            "thenTargetMax": 10.5          }        ]      }    ],    "posDiscounts": [      {        "_id": "string",        "name": "string",        "discountType": "fix",        "value": 10.5      }    ],    "categories": [      {        "_id": "string",        "name": "string",        "description": "string",        "seatingReference": "string",        "ref": "string",        "amount": 10.5,        "recommendedTicket": "string",        "maxAmountPerOrder": 10.5,        "listWithoutSeats": true      }    ],    "tickets": [      {        "_id": "string",        "name": "string",        "description": "string",        "image": "string",        "color": "string",        "price": 10.5,        "amount": 10.5,        "active": true,        "posActive": true,        "categoryRef": "string",        "ignoredForStartingPrice": true,        "conditionalAvailability": true,        "ticketBackground": "string",        "rules": [          {            "_id": "string",            "ticketGroup": "string",            "min": 10.5,            "max": 10.5          }        ],        "requiresPersonalization": true,        "requiresPersonalizationMode": "ENABLED",        "requiresExtraFields": true,        "requiresExtraFieldsMode": "ENABLED",        "repersonalizationFee": 10.5,        "sortingKey": 10.5,        "enableHardTicketOption": true,        "forceHardTicketOption": true,        "maxAmountPerOrder": 10.5,        "minAmountPerOrder": 10.5,        "minAmountPerOrderRule": 10.5,        "taxRate": 10.5,        "styleOptions": {},        "priceCategoryId": "string",        "entryPermissions": [],        "ignoreForMaxAmounts": true,        "expirationSettings": {},        "barcodePrefix": "string",        "salesStart": {          "target": "string",          "unit": "hours",          "offset": 1        },        "salesEnd": {          "target": "string",          "unit": "hours",          "offset": 1        },        "transferSettings": {},        "scanSettings": {          "feedback": "highlight"        },        "deliverySettings": {          "wallet": {            "enabled": "ENABLED"          },          "pdf": {            "enabled": "ENABLED"          }        },        "meta": {}      }    ],    "createdAt": "2030-01-23T23:00:00.123Z",    "updatedAt": "2030-01-23T23:00:00.123Z",    "start": "2030-01-23T23:00:00.123Z",    "end": "2030-01-23T23:00:00.123Z",    "sellStart": "2030-01-23T23:00:00.123Z",    "sellEnd": "2030-01-23T23:00:00.123Z",    "maxAmount": 10.5,    "maxAmountPerOrder": 10.5,    "maxAmountPerCustomer": 10.5,    "maxTransactionsPerCustomer": 10.5,    "minAmountPerOrder": 1,    "customerTags": [],    "customerSegments": [],    "showCountdown": true,    "hideInListing": true,    "visibleAfter": "2030-01-23T23:00:00.123Z",    "customSettings": {},    "extraFields": [      {        "_id": "string",        "name": "string",        "description": "string",        "required": true,        "collectInCheckout": true,        "deleted": true,        "type": "text",        "options": [          "string"        ],        "onlyForCertainTicketTypes": true,        "allowedTicketTypes": [],        "printable": true,        "conditions": [          {            "_id": "string",            "baseSlug": "string",            "value": [],            "operator": "equals"          }        ]      }    ],    "ticketExtraFields": [      {        "_id": "string",        "name": "string",        "description": "string",        "required": true,        "collectInCheckout": true,        "deleted": true,        "type": "text",        "options": [          "string"        ],        "onlyForCertainTicketTypes": true,        "allowedTicketTypes": [],        "printable": true,        "conditions": [          {            "_id": "string",            "baseSlug": "string",            "value": [],            "operator": "equals"          }        ]      }    ],    "accentColor": "#006DCC",    "pageStyle": "white",    "showOtherEvents": true,    "underShops": [      {        "_id": "string",        "name": "string",        "active": true,        "tickets": [          {            "_id": "string",            "baseTicket": "string",            "name": "string",            "description": "string",            "price": 10.5,            "amount": 10.5,            "active": true          }        ],        "sellStart": "2030-01-23T23:00:00.123Z",        "sellEnd": "2030-01-23T23:00:00.123Z",        "maxAmount": 10.5,        "maxAmountPerOrder": 10.5,        "minAmountPerOrder": 1,        "maxTransactionsPerCustomer": 10.5,        "maxAmountPerCustomer": 10.5,        "ticketShopHeaderText": "string",        "customCharges": {},        "seatingContingents": [          "string"        ],        "availabilityMode": "default",        "bestAvailableSeatingConfiguration": {          "enabled": true,          "enforced": true,          "allowMassBooking": true        },        "reservationSettings": {          "option": "noReservations"        },        "accountSettings": {          "_id": "string",          "enforceAccounts": true,          "enforceAuthentication": "DISABLED"        },        "customerTags": [],        "customerSegments": [],        "allowMassDownload": true,        "inventoryStrategy": "independent",        "extraFields": [          {            "_id": "string",            "name": "string",            "description": "string",            "required": true,            "collectInCheckout": true,            "deleted": true,            "type": "text",            "options": [              "string"            ],            "onlyForCertainTicketTypes": true,            "allowedTicketTypes": [],            "printable": true,            "conditions": [              {                "_id": "string",                "baseSlug": "string",                "value": [],                "operator": "equals"              }            ]          }        ],        "salesChannelGroupSettings": [          {            "salesChannelGroupId": "string"          }        ],        "paymentSettings": {          "paymentStrategyId": "string"        },        "unlockMode": "none"      }    ],    "seating": {      "_id": "string",      "active": true,      "eventKey": "string",      "eventId": "string",      "seatMapId": "string",      "revisionId": "string",      "orphanConfiguration": {        "_id": "string",        "minSeatDistance": 2,        "edgeSeatsOrphaning": true      },      "contingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true      }    },    "customTextConfig": {      "_id": "string",      "buyTicketsCTA": "string"    },    "eventType": "SINGLE",    "childEvents": [      "string"    ],    "url": "string",    "tags": [      "string"    ],    "seoSettings": {      "_id": "string",      "tags": [        "string"      ],      "noIndex": true,      "title": "string",      "description": "string"    },    "extraInformation": {      "_id": "string",      "type": "string",      "category": "string",      "subCategory": "string"    },    "customCharges": {      "_id": "string",      "outerChargeVar": 10.5,      "innerChargeVar": 10.5,      "outerChargeFix": 10.5,      "innerChargeFix": 10.5,      "posOuterChargeFix": 10.5,      "posOuterChargeVar": 10.5,      "cartOuterChargeFix": 10.5    },    "gallery": [      {        "_id": "string",        "title": "string",        "description": "string",        "copyright": "string",        "index": 10.5,        "image": "string"      }    ],    "video": {      "youtubeID": "string"    },    "soldOutFallback": {      "_id": "string",      "soldOutFallbackType": "default",      "soldOutFallbackLink": "string"    },    "ticketDesign": {      "_id": "string",      "useCustomDesign": true,      "customDesignURL": "string",      "footerDesignURL": "string",      "disclaimer": "string",      "infoColor": "string",      "showTimeRange": true,      "hideDates": true,      "hideTimes": true    },    "checkinInformation": {      "_id": "string",      "checkinStarts": "2030-01-23T23:00:00.123Z"    },    "tracking": {      "facebookPixel": {        "active": true,        "pixelId": "string"      },      "tagging": {        "enabled": true,        "tags": [          "string"        ]      }    },    "hardTicketSettings": {      "_id": "string",      "enabled": true,      "fulfillmentType": "self",      "printingMethod": "preprinted",      "hardTicketOuterCharge": 10.5,      "hardTicketInnerCharge": 10.5,      "hardTicketPreviewURL": "string",      "promotionName": "string",      "promotionText": "string",      "requiredDays": 1    },    "dataRequestSettings": {      "requiresPersonalization": false,      "requiresExtraFields": false,      "repersonalization": false,      "posPersonalization": "noPersonalization"    },    "styleOptions": {      "headerStyle": "default",      "hideLocationMap": false,      "hideLocationAddress": false,      "categoryAlignment": 0,      "showAvailabilityIndicator": false,      "availabilityIndicatorThresholds": [        0.3,        0.7      ]    },    "geoCode": {      "_id": "string",      "lat": 10.5,      "lng": 10.5    },    "accountSettings": {      "_id": "string",      "enforceAccounts": true,      "enforceAuthentication": "DISABLED"    },    "reservationSettings": {      "option": "noReservations"    },    "upsellSettings": {      "_id": "string",      "active": true,      "productStream": "string",      "headerImage": "string",      "crossSells": {        "eventIds": [          "string"        ]      }    },    "repetitionSettings": [      {        "every": 10.5,        "unit": "DAY",        "repeatsOn": [          "SUNDAY"        ],        "from": "2030-01-23T23:00:00.123Z",        "to": "2030-01-23T23:00:00.123Z"      }    ],    "rootId": "string",    "daySchemes": [      {        "_id": "string",        "name": "string",        "color": "string",        "offers": {}      }    ],    "daySchemeId": "string",    "ticketSettings": {},    "accessListMapping": [      {        "listId": "string",        "ticketTypeId": "string"      }    ],    "deliverySettings": {      "wallet": {        "enabled": "ENABLED",        "nfc": "ENABLED",        "seasonCardShowNextEvent": true      },      "pdf": {        "enabled": "ENABLED"      }    },    "meta": {},    "timezone": "string",    "salesChannelGroupSettings": [      {        "salesChannelGroupId": "string"      }    ],    "paymentSettings": {      "paymentStrategyId": "string"    },    "timeSlots": [      {        "_id": "string",        "startTime": {          "hour": 1,          "minute": 1        },        "refs": [          {            "refType": "category",            "categoryRef": "string"          }        ],        "amount": 10.5      }    ],    "useTimeSlots": true,    "attributes": {}  }]
```

## [The Event Info object](https://docs.vivenu.dev/tickets#the-event-info-object)

You can retrieve the Event info object with the Get Event info endpoint. This API provides information about how and with which settings you sell an event's tickets.

#### Attributes

An ISO timestamp indicating when the event starts

An ISO timestamp indicating when the event ends

#### Optional Attributes

Expand all

A description about the event. Description is in RichText - JSON format.

The name of the location where the event takes place

An array of POS discounts of the event

posDiscounts\[\].\_id

Required

string

The ID of the POS discount

posDiscounts\[\].name

Required

string

The name of the POS discount

posDiscounts\[\].value

Required

number float

The value of the POS discount

#### Optional Attributes

Expand all

posDiscounts\[\].discountType

Optional

string

The type of the POS discount

`TOTAL``PERCENTAGE``fix``var``fixPerItem`

An array of ticket categories of the event

The ID of the ticket category of the event

categories\[\].name

Required

string

The name of the ticket category of the event

#### Optional Attributes

Expand all

categories\[\].description

Optional

string

The description of the ticket category of the event

categories\[\].seatingReference

Optional

string

The ID of the seating category

The reference to identify the seating category

categories\[\].amount

Optional

number float

The amount of available tickets of the category of the event

categories\[\].recommendedTicket

Optional

string

Recommended ticket of the category

categories\[\].maxAmountPerOrder

Optional

number float

Maximum amount per order of the category

categories\[\].listWithoutSeats

Optional

boolean

Whether this category can be sold without seats

An array of groups of ticket types of the event

The ID of of the ticket group of the event

The name of the ticket group of the event

An array of ID's of ticket types of the event

cartAutomationRules

Optional

array

An array of automation rules for carts of the event

cartAutomationRules\[\].\_id

Required

string

The ID of the cart automation rule

cartAutomationRules\[\].name

Required

string

The name of the automation rule for carts of the event

cartAutomationRules\[\].triggerType

Required

string

The trigger type of the automation rule.

cartAutomationRules\[\].triggerTargetGroup

Required

string

The trigger target group of the rule. The ID of a ticket group

cartAutomationRules\[\].thenType

Required

string

The type of thenType of the rule. autoAdd = is the type to add automatically to cart. chooseFrom = is the type to choose from e.g. another ticket group

#### Optional Attributes

Expand all

cartAutomationRules\[\].thenTargets

Optional

array

The target of the then type

cartAutomationRules\[\].thenTargets\[\].\_id

Required

string

The ID of the then target

#### Optional Attributes

Expand all

cartAutomationRules\[\].thenTargets\[\].thenTargetGroup

Optional

string

The ID of the ticket group 'then' refers to

cartAutomationRules\[\].thenTargets\[\].thenTargetMin

Optional

number float

Minimum amount of tickets where the then action is valid

cartAutomationRules\[\].thenTargets\[\].thenTargetMax

Optional

number float

Maximum amount of tickets where the then action is valid

An array of discount groups of the event

discountGroups\[\].\_id

Required

string

The ID of the discount group of the event

discountGroups\[\].name

Required

string

The name of the discount group of the event

discountGroups\[\].value

Required

number float

The value of the discount group

#### Optional Attributes

Expand all

discountGroups\[\].rules

Optional

array

An array of rules of the discount group

discountGroups\[\].rules\[\].\_id

Required

string

The ID of the discount group rule

discountGroups\[\].rules\[\].min

Required

number float

Minimum amount of tickets where the discount is valid

discountGroups\[\].rules\[\].max

Required

number float

Maximum amount of tickets where the discount is valid

#### Optional Attributes

Expand all

discountGroups\[\].rules\[\].group

Optional

string

The ID of the discount group

discountGroups\[\].rules\[\].type

Optional

string

The type of the discount rule. ticketGroups is the type for tickets. cartSum is the type for sum of a cart

discountGroups\[\].discountType

Optional

string

The type of the discount group. TOTAL = absolute discount. PERCENTAGE = percentage discount. fix = fixed discount. var = variable discount

`TOTAL``PERCENTAGE``fix``var``fixPerItem`

An array of extra fields of the event

extraFields\[\].\_id

Required

string

The ID of the extra field

extraFields\[\].required

Required

boolean

Whether the extra field is required

#### Optional Attributes

Expand all

extraFields\[\].name

Optional

string

The name of the extra field

extraFields\[\].description

Optional

string

The description of the extra field

extraFields\[\].collectInCheckout

Optional

boolean

Whether the extra field is collected in checkout

extraFields\[\].deleted

Optional

boolean

Whether the extra field is deleted

extraFields\[\].type

Optional

string

The type of the extra field. text = is a text field. number = is a number field. select = is a selection field of different selections. checkbox = is a checkbox field. tel = is a number field for a phone number. email = is a text field for an email. country = is a text field field for country.

`text``number``select``checkbox``tel``country``email``date``documentUpload``signature`

extraFields\[\].options

Optional

array<string>

An array of options of the extra field

extraFields\[\].onlyForCertainTicketTypes

Optional

boolean

Whether the extra field is only for certain ticket types

extraFields\[\].allowedTicketTypes

Optional

array<string>

An array of IDs of the ticket types allowed for the extra field

extraFields\[\].printable

Optional

boolean

Whether the extra field is printable

extraFields\[\].conditions

Optional

array

An array of conditions of the extra field. The conditions can refer to other extra fields.

extraFields\[\].conditions\[\].\_id

Required

string

The ID of the condition

extraFields\[\].conditions\[\].baseSlug

Required

string

The slug of the base extra field which the condition refers to

extraFields\[\].conditions\[\].value

Required

The value which the operator will be used on to check the condition.

One of

Only one of the following types

extraFields\[\].conditions\[\].operator

Required

string

The operator which will be used to check the condition

`equals``notEquals``greaterThan``lessThan``greaterThanOrEquals``lessThanOrEquals``exists``notExists`

ticketExtraFields

Optional

array

An array of extra fields for ticket types of the event

ticketExtraFields\[\].\_id

Required

string

The ID of the extra field

ticketExtraFields\[\].required

Required

boolean

Whether the extra field is required

#### Optional Attributes

Expand all

ticketExtraFields\[\].name

Optional

string

The name of the extra field

ticketExtraFields\[\].description

Optional

string

The description of the extra field

ticketExtraFields\[\].collectInCheckout

Optional

boolean

Whether the extra field is collected in checkout

ticketExtraFields\[\].deleted

Optional

boolean

Whether the extra field is deleted

ticketExtraFields\[\].type

Optional

string

The type of the extra field. text = is a text field. number = is a number field. select = is a selection field of different selections. checkbox = is a checkbox field. tel = is a number field for a phone number. email = is a text field for an email. country = is a text field field for country.

`text``number``select``checkbox``tel``country``email``date``documentUpload``signature`

ticketExtraFields\[\].options

Optional

array<string>

An array of options of the extra field

ticketExtraFields\[\].onlyForCertainTicketTypes

Optional

boolean

Whether the extra field is only for certain ticket types

ticketExtraFields\[\].allowedTicketTypes

Optional

array<string>

An array of IDs of the ticket types allowed for the extra field

ticketExtraFields\[\].printable

Optional

boolean

Whether the extra field is printable

ticketExtraFields\[\].conditions

Optional

array

An array of conditions of the extra field. The conditions can refer to other extra fields.

ticketExtraFields\[\].conditions\[\].\_id

Required

string

The ID of the condition

ticketExtraFields\[\].conditions\[\].baseSlug

Required

string

The slug of the base extra field which the condition refers to

ticketExtraFields\[\].conditions\[\].value

Required

The value which the operator will be used on to check the condition.

One of

Only one of the following types

ticketExtraFields\[\].conditions\[\].operator

Required

string

The operator which will be used to check the condition

`equals``notEquals``greaterThan``lessThan``greaterThanOrEquals``lessThanOrEquals``exists``notExists`

Style options of the event page

#### Optional Attributes

Expand all

styleOptions.headerStyle

Optional

string

Header style of the event page

styleOptions.brandOne

Optional

string

First brand of the event

styleOptions.brandTwo

Optional

string

Second brand of the event

styleOptions.hideLocationMap

Optional

boolean

Whether the location map on the event page hide

styleOptions.hideLocationAddress

Optional

boolean

Whether the location address on the event page hide

styleOptions.categoryAlignment

Optional

number float

The style of category alignment. 0 = cascade = categories among themselves. 1 = asTabs = categories as tabs. 2 = boxes = categories as boxes

styleOptions.showAvailabilityIndicator

Optional

boolean

Whether the availability indicator on the event page should be shown

styleOptions.availabilityIndicatorThresholds

Optional

array<number>

The availability indicator thresholds of the event

styleOptions.showAvailable

Optional

boolean

Whether to show availability of the time slot. Only applicable for time slot events.

The video settings of the event

#### Optional Attributes

Expand all

The youtube video ID of the event video setting

An array of gallery items of the event

The ID of the gallery item

#### Optional Attributes

Expand all

The title of the gallery item

gallery\[\].description

Optional

string

The description of the gallery item

gallery\[\].copyright

Optional

string

The copyright of the gallery item

The index of the gallery item

The image of the gallery item

checkinInformation

Optional

object

The checkin information of the event

checkinInformation.\_id

Required

string

The ID of the checkin information of the event

#### Optional Attributes

Expand all

checkinInformation.checkinStarts

Optional

string date-time

The date of when the checkin of the event starts

The accent color of the event page

The ID of the seller owning this event

An ISO timestamp indicating when the event sale starts

A header image for the ticket shop of the event

hardTicketSettings

Optional

object

The hard ticket settings of the event

hardTicketSettings.\_id

Required

string

The ID of the event hard ticket settings

#### Optional Attributes

Expand all

hardTicketSettings.enabled

Optional

boolean

Whether hard tickets can be bought for this event

hardTicketSettings.fulfillmentType

Optional

string

The type of fulfillment. self fulfilled by the seller. managed fulfilled by vivenu.

hardTicketSettings.printingMethod

Optional

string

Which printing method is used. preprinted = The tickets are preprinted. adhoc = The tickets are printed ad-hoc.

hardTicketSettings.hardTicketOuterCharge

Optional

number float

Additional charge for every hard ticket that is added to the ticket price and the other outer charges - paid by the ticket buyer.

hardTicketSettings.hardTicketInnerCharge

Optional

number float

Additional charge for hard tickets as in the contract of the seller

hardTicketSettings.hardTicketPreviewURL

Optional

string

The hard ticket design image

hardTicketSettings.promotionName

Optional

string

A special name for hard tickets. e.g. "Collector edition"

hardTicketSettings.promotionText

Optional

string

A description about what makes this ticket so special

hardTicketSettings.requiredDays

Optional

integer

Required days until deliver of the hard tickets

The tracking of the event

#### Optional Attributes

Expand all

tracking.facebookPixel

Optional

object

The facebook pixel information of the event tracking

#### Optional Attributes

Expand all

tracking.facebookPixel.active

Optional

boolean

Whether facebook pixel of event tracking is active

tracking.facebookPixel.pixelId

Optional

string

The ID of facebook pixel of the event tracking

The tagging of the event tracking

#### Optional Attributes

Expand all

tracking.tagging.enabled

Optional

boolean

Whether tagging of event tracking is enabled

tracking.tagging.tags

Optional

array<string>

An array of tags of the event tracking

Account settings of the event

accountSettings.\_id

Required

string

The ID of the account settings of the event

#### Optional Attributes

Expand all

accountSettings.enforceAccounts

Optional

Deprecated

boolean

Whether to enforce accounts for the event

accountSettings.enforceAuthentication

Optional

string

Whether to enforce authentication for the event and how to enforce it

`DISABLED``PREVENT_CHECKOUT``PREVENT_DETAILS_STEP`

dataRequestSettings

Optional

object

The data request settings of the event

dataRequestSettings.\_id

Required

string

The ID of the data request settings of the event

#### Optional Attributes

Expand all

dataRequestSettings.requiresPersonalization

Optional

boolean

Whether the tickets for this event need personalization

dataRequestSettings.requiresExtraFields

Optional

boolean

Whether the tickets for this event need extra data fields

dataRequestSettings.repersonalization

Optional

Deprecated

boolean

Whether the tickets can be re personalized.

dataRequestSettings.repersonalizationAllowed

Optional

boolean

Whether the tickets can be re personalized.

dataRequestSettings.repersonalizationEndDate

Optional

Deprecated

string date-time

If repersonalization = true. Until when the re personalization is allowed.

dataRequestSettings.repersonalizationDeadline

Optional

object

If repersonalization = true. A relatve date specification until when the re personalization is allowed.

dataRequestSettings.repersonalizationDeadline.unit

Required

string

The unit in which the offset is specified

dataRequestSettings.repersonalizationDeadline.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

dataRequestSettings.repersonalizationDeadline.target

Optional

string

The target of the relative date

dataRequestSettings.repersonalizationFee

Optional

number float

If repersonalization = true. The per-ticket fee for repersonalization.

dataRequestSettings.repersonalizationsLimit

Optional

number float

If repersonalization = true. The number of times repersonalization is allowed.

dataRequestSettings.posPersonalization

Optional

string

The type of personalization for this event on Point of Sale applications.

`noPersonalization``optionalPersonalization``requiredPersonalization`

dataRequestSettings.skipAddressInfo

Optional

boolean

Whether the checkout should not ask for the address of the ticket buyer.

dataRequestSettings.enforceCompany

Optional

boolean

Whether the company of the ticket buyer is a required field.

The search engine optimization settings of the event

The ID of the SEO setting

#### Optional Attributes

Expand all

An array of tags of the seo settings

seoSettings.noIndex

Optional

boolean

Whether the seo setting has no indexing

seoSettings.title

Optional

string

The title of the seo settings

seoSettings.description

Optional

string

The description of the seo settings

The sold out fallback of the event

soldOutFallback.\_id

Required

string

The ID of sold out entry

#### Optional Attributes

Expand all

soldOutFallback.soldOutFallbackType

Optional

string

`default``moreinformation``waitinglist`

soldOutFallback.soldOutFallbackLink

Optional

string

The link of the sold out fallback

reservationSettings

Optional

object

The reservation settings of event

reservationSettings.\_id

Required

string

The ID of the reservation setting

#### Optional Attributes

Expand all

reservationSettings.option

Optional

string

The option of the reservation setting. reservationsOnly = needs reservation only. noReservations = no reservations needed. reservationsAndPayment = needs reservation and payment

`noReservations``reservationsOnly``reservationsAndPayment``internalReservationsAndPayment`

reservationSettings.strategyId

Optional

string

The ID of the strategy of a purchase intents to be used on the event

The custom text configuration of the event

customTextConfig.\_id

Required

string

The ID of the custom text configuration

#### Optional Attributes

Expand all

customTextConfig.buyTicketsCTA

Optional

string

The custom CTA after buy tickets

Custom settings of the event

customSettings.\_id

Required

string

The ID of the custom settings of the event

#### Optional Attributes

Expand all

customSettings.hideTicketsInTransactionPage

Optional

boolean

Whether the ticket types of the event should be visible on transaction page

customSettings.dontSendTicketMail

Optional

boolean

Whether an email should be sent of tickets of the event

customSettings.dontSendBookingConfirmationMail

Optional

boolean

Whether an email should be sent for booking confirmation

customSettings.customMailHeaderImage

Optional

string

A custom header image of the mail for ticket types of the event

customSettings.customTransactionCompletionText

Optional

string

A custom transaction completion text for completed transactions of the event

customSettings.disableAppleWallet

Optional

Deprecated

boolean

Whether the Apple and Google Wallet functionality should be disabled on the event. Deprecated: use event.deliverySettings.wallet instead

customSettings.disablePdfTickets

Optional

Deprecated

boolean

Whether the PDF tickets download functionality should be disabled on the event. Deprecated: use event.deliverySettings.pdf instead

customSettings.showStartDate

Optional

boolean

Whether the start date of the event should be visible on listings

customSettings.showStartTime

Optional

boolean

Whether the start time of the event should be visible on listings

customSettings.showEndDate

Optional

boolean

Whether the end date of the event should be visible on listings

customSettings.showEndTime

Optional

boolean

Whether the end time of the event should be visible on listings

customSettings.showTimeRangeInListing

Optional

Deprecated

boolean

Whether the end time of the event should be visible on listings

customSettings.showTimeRangeInTicket

Optional

boolean

Whether the time range of the event should be visible on ticket PDFs

customSettings.customCheckoutCSS

Optional

string

Custom CSS styling of the checkout of the event

customSettings.useCustomCheckoutBrand

Optional

boolean

Whether the checkout of the event should use custom brand

customSettings.customCheckoutBrand

Optional

string

A custom checkout brand of the event

customSettings.hideLogoInCheckout

Optional

boolean

Whether the logo should be hide on the checkout of the event

customSettings.customEventPageHTML

Optional

string

A custom HTML of the event page

customSettings.customEventPageCSS

Optional

string

A custom css styling of the event page

customSettings.customConfirmationPage

Optional

string

A custom css styling of the event page

customSettings.hideSeatmapInCheckout

Optional

boolean

Hides the seatmap from the ticket buyer even if seating ticket types are available

customSettings.dontSendBookingConfirmationSMS

Optional

boolean

Whether a sms should be sent for booking confirmation

The upsell settings of the event

upsellSettings.\_id

Required

string

The ID of the upsell settings of the event

#### Optional Attributes

Expand all

upsellSettings.active

Optional

boolean

Whether upselling is active on the event

upsellSettings.productStream

Optional

string

The product stream for upselling

upsellSettings.headerImage

Optional

string

A header image for the ticket shop, when selecting products

upsellSettings.crossSells

Optional

object

The cross selling settings.

#### Optional Attributes

Expand all

upsellSettings.crossSells.eventIds

Optional

array<string>

The array of the promoted event IDs.

Whether the event uses time slots.

The ID of the selected under shop

Sets how event is locked, e.g. by coupon code.

The ID of the selected channel

Whether seating is active or not

The ID of the seating event

seatingChildEventIds

Optional

array<string>

The seating event IDs of the child events. Usually used to render maps for season ticket events

seatingConfigurations

Optional

object

Settings to control the behaviour of maps

An array of contingents IDs

The default tax rate of the event

Maximum amount of tickets per order

Minimum amount of tickets per order

The remaining volume of the event

The starting price of the event

showTimeRangeInTicket

Optional

boolean

Whether to show the start and end time of the event on a ticket PDF or not

showTimeRangeInListing

Optional

Deprecated

boolean

Whether to show the start and end time of the event in listings or not

Whether to show the countdown till the sale of the event starts or not

Whether to show other events of the seller on the event page

Whether customer accounts for the event are enabled or not

The default currency of the event

`EUR``USD``GBP``AUD``CHF``THB``ILS``COP``MXN``DKK``NOK``SEK``QAR``CAD``ISK``GTQ``INR``DOP``SGD``PLN``SAR``TTD``ZAR``KYD``HKD``CZK``KRW``JPY``NZD``AED``MAD``TWD``BRL``BWP``NAD`

#### Optional Attributes

Expand all

seller.description

Optional

string

The description of the seller

seller.documentImage

Optional

string

The logo of the seller visible on ticket PDFs

seller.supportUrl

Optional

string

The support url of the seller

seller.customLogo

Optional

string

Custom seller branding logo

seller.defaultLanguage

Optional

string

The language of the seller

#### Optional Attributes

Expand all

location.locationName

Optional

string

The name of the location where the event takes place

location.locationStreet

Optional

string

The street of the location where the event takes place

location.locationCity

Optional

string

The city of the location where the event takes place

location.locationPostal

Optional

string

The postal code of the location where the event takes place

location.locationCountry

Optional

string

The country code of the location where the event takes place

The geographic code of the event

location.geoCode.\_id

Required

string

The ID of the geo code

location.geoCode.lat

Required

number float

Latitude coordinate of the geo code

location.geoCode.lng

Required

number float

Longitude coordinate of the geo code

Time slots of the assigned event day scheme.

The start time of the time slot.

Maximum amount the time slot could be used.

#### Optional Attributes

Expand all

#### Optional Attributes

Expand all

slots\[\].offers.allTicketTypesActive

Optional

boolean

Whether the all ticket types active.

slots\[\].offers.ticketTypes

Optional

array

The day scheme offer ticket types.

slots\[\].offers.ticketTypes\[\].ticketTypeId

Required

string

The ticket type id which could be sold.

#### Optional Attributes

Expand all

slots\[\].offers.ticketTypes\[\].active

Optional

boolean

Whether the ticket type is selling.

slots\[\].offers.timeSlots

Optional

array

Time slots overrides.

slots\[\].offers.timeSlots\[\].slotId

Required

string

The slotId of the time slot.

#### Optional Attributes

Expand all

slots\[\].offers.timeSlots\[\].enabled

Optional

string

Whether the slot is enabled.

slots\[\].offers.timeSlots\[\].amount

Optional

number float

The amount of available tickets of the time slot of the day scheme.

The time slots for the event

timeSlots\[\].startTime

Required

object

The time of day the time slot starts

timeSlots\[\].startTime.hour

Required

integer

timeSlots\[\].startTime.minute

Required

integer

The remaining volume of the time slot

timeSlots\[\].startingPrice

Required

number float

The starting price of the time slot

#### Optional Attributes

Expand all

timeSlots\[\].categories

Optional

array

The categories of the time slot

timeSlots\[\].categories\[\].v

Required

number float

The remaining volume of the category

#### Optional Attributes

Expand all

timeSlots\[\].categories\[\].categoryRef

Optional

string

The reference of the category of the time slot

timeSlots\[\].ticketTypes

Optional

array

The ticket types of the time slot

timeSlots\[\].ticketTypes\[\].v

Required

number float

The remaining volume of the ticket type

#### Optional Attributes

Expand all

timeSlots\[\].ticketTypes\[\].ticketTypeId

Optional

string

The ID of the ticket type

timeSlots\[\].availabilityIndicator

Optional

string

The availability of the time slot. It shows whether there are tickets available. green = Enough available tickets. yellow = The tickets are almost sold out. red = There are no more available tickets

ticketShopHeaderText

Optional

string

An array of ticket types of the event

The ID of the ticket type of the event

The name of the ticket type of the event

The price of the ticket type of the event

Whether the ticket type of the event is active

#### Optional Attributes

Expand all

The font color of the ticket type of the event

tickets\[\].description

Optional

string

The description of the ticket type of the event

tickets\[\].categoryRef

Optional

string

The reference of the category of the ticket type of the event

tickets\[\].requiresPersonalization

Optional

boolean

Whether the ticket type of the event needs personalization

tickets\[\].sortingKey

Optional

number float

The key to sort the ticket type within the ticket group

tickets\[\].enableHardTicketOption

Optional

boolean

Whether the ticket type is a hard ticket

tickets\[\].forceHardTicketOption

Optional

boolean

Whether to force the hard ticket option

tickets\[\].maxAmountPerOrder

Optional

number float

Maximum amount per order of the ticket type

tickets\[\].minAmountPerOrder

Optional

number float

Minimum amount per order of the ticket type

tickets\[\].minAmountPerOrderRule

Optional

number float

Minimum amount of the ticket type, where the minAmountPerOrder goes active

tickets\[\].taxRate

Optional

number float

The tax rate of the ticket type of the event

tickets\[\].styleOptions

Optional

object

Style options of the ticket type

#### Optional Attributes

Expand all

tickets\[\].styleOptions.thumbnailImage

Optional

string

Thumbnail of the ticket type, which will be displayed on checkout

tickets\[\].styleOptions.showAvailable

Optional

boolean

Whether to show availability of the ticket type

tickets\[\].styleOptions.hiddenInSelectionArea

Optional

boolean

Whether to show this ticket in the selection area

tickets\[\].ignoreForMaxAmounts

Optional

boolean

Do not include tickets if this typw when calculating available amount in categories and event

tickets\[\].conditionalAvailability

Optional

boolean

Whether rules can be operated on the ticket type

tickets\[\].conditionalAvailabilityMode

Optional

string

The conditional availability mode of the ticket type

`blockAddToCart``blockCheckout`

An array of rules for the ticket type of the event

tickets\[\].rules\[\].\_id

Required

string

The ID of the ticket type rule

tickets\[\].rules\[\].ticketGroup

Required

string

The ID of the ticket group to operate the rule on

tickets\[\].rules\[\].min

Required

number float

Minimum amount of tickets where the rule is active

tickets\[\].rules\[\].max

Required

number float

Maximum amount of tickets where the rule is active

tickets\[\].outerChargeFix

Optional

number float

The outer charge fix of the ticket type of the event

tickets\[\].innnerChargeFix

Optional

number float

The inner charge fix of the ticket type of the event

tickets\[\].dynamicFees

Optional

array<object>

Dynamic fees of the ticket type

tickets\[\].salesStart

Optional

object

A relative date before the end of the event, when the sale of this ticket type starts

tickets\[\].salesStart.unit

Required

string

The unit in which the offset is specified

tickets\[\].salesStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].salesStart.target

Optional

string

The target of the relative date

tickets\[\].salesEnd

Optional

object

A relative date before the end of the event, when the sale of this ticket type ends

tickets\[\].salesEnd.unit

Required

string

The unit in which the offset is specified

tickets\[\].salesEnd.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].salesEnd.target

Optional

string

The target of the relative date

tickets\[\].subscriptionSettings

Optional

object

tickets\[\].priceTableTypeId

Optional

string

Custom key-value data. Metadata is useful for storing additional, structured information on an object.

tickets\[\].resellSettings

Optional

object

Resell settings.

#### Optional Attributes

Expand all

tickets\[\].resellSettings.enabled

Optional

string

Whether secondary market settings enabled.

#### Optional Attributes

Expand all

resell.saleActive

Optional

boolean

Whether the event has buying from the secondary market active.

resell.offerActive

Optional

boolean

Whether the event has selling on the secondary market active.

Was this section helpful?

YesNo

```
{  "_id": "string",  "name": "string",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "url": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "image": "string",  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "video": {    "youtubeID": "string"  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "accentColor": "#006DCC",  "sellerId": "string",  "sellStart": "2030-01-23T23:00:00.123Z",  "ticketShopHeader": "string",  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "reservationSettings": {    "option": "noReservations"  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "customSettings": {},  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "useTimeSlots": true,  "saleStatus": "onSale",  "underShopId": "string",  "unlockMode": "none",  "channelId": "string",  "seating": true,  "seatingEventId": "string",  "seatingChildEventIds": [    "string"  ],  "seatingConfigurations": {},  "contingents": [    "string"  ],  "theme": "string",  "taxRate": 10.5,  "max": 10.5,  "min": 10.5,  "v": 10.5,  "cXv": 10.5,  "cXf": 10.5,  "ccXf": 10.5,  "startingPrice": "string",  "showTimeRangeInTicket": true,  "showTimeRangeInListing": true,  "showCountdown": true,  "showOtherEvents": true,  "accountsModule": true,  "stripe_api_key": "string",  "currency": "EUR",  "seller": {    "name": "string",    "description": "string",    "image": "string",    "documentImage": "string",    "url": "string",    "supportUrl": "string",    "customLogo": "string",    "defaultLanguage": "string"  },  "timezone": "string",  "location": {    "locationName": "string",    "locationStreet": "string",    "locationCity": "string",    "locationPostal": "string",    "locationCountry": "string",    "geoCode": {      "_id": "string",      "lat": 10.5,      "lng": 10.5    }  },  "slots": [    {      "_id": "string",      "start": "string",      "amount": 1,      "offers": {}    }  ],  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "v": 10.5,      "startingPrice": 10.5,      "categories": [        {          "categoryRef": "string",          "v": 10.5        }      ],      "ticketTypes": [        {          "ticketTypeId": "string",          "v": 10.5        }      ],      "availabilityIndicator": "green"    }  ],  "ticketShopHeaderText": "string",  "tickets": [    {      "id": "string",      "v": 10.5,      "name": "string",      "price": 10.5,      "color": "string",      "description": "string",      "active": true,      "categoryRef": "string",      "requiresPersonalization": true,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "ignoreForMaxAmounts": true,      "conditionalAvailability": true,      "conditionalAvailabilityMode": "blockAddToCart",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "outerChargeFix": 10.5,      "innnerChargeFix": 10.5,      "dynamicFees": [        {}      ],      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "subscriptionSettings": {},      "priceTableTypeId": "string",      "meta": {},      "resellSettings": {        "enabled": "ENABLED"      }    }  ],  "resell": {    "saleActive": true,    "offerActive": true  }}
```

PUBLIC

## [Get Event info](https://docs.vivenu.dev/tickets#get-event-info)

#### Query

Get the info for a specific language

Was this section helpful?

YesNo

```
{  "_id": "string",  "name": "string",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "url": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "image": "string",  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "video": {    "youtubeID": "string"  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "accentColor": "#006DCC",  "sellerId": "string",  "sellStart": "2030-01-23T23:00:00.123Z",  "ticketShopHeader": "string",  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "reservationSettings": {    "option": "noReservations"  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "customSettings": {},  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "useTimeSlots": true,  "saleStatus": "onSale",  "underShopId": "string",  "unlockMode": "none",  "channelId": "string",  "seating": true,  "seatingEventId": "string",  "seatingChildEventIds": [    "string"  ],  "seatingConfigurations": {},  "contingents": [    "string"  ],  "theme": "string",  "taxRate": 10.5,  "max": 10.5,  "min": 10.5,  "v": 10.5,  "cXv": 10.5,  "cXf": 10.5,  "ccXf": 10.5,  "startingPrice": "string",  "showTimeRangeInTicket": true,  "showTimeRangeInListing": true,  "showCountdown": true,  "showOtherEvents": true,  "accountsModule": true,  "stripe_api_key": "string",  "currency": "EUR",  "seller": {    "name": "string",    "description": "string",    "image": "string",    "documentImage": "string",    "url": "string",    "supportUrl": "string",    "customLogo": "string",    "defaultLanguage": "string"  },  "timezone": "string",  "location": {    "locationName": "string",    "locationStreet": "string",    "locationCity": "string",    "locationPostal": "string",    "locationCountry": "string",    "geoCode": {      "_id": "string",      "lat": 10.5,      "lng": 10.5    }  },  "slots": [    {      "_id": "string",      "start": "string",      "amount": 1,      "offers": {}    }  ],  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "v": 10.5,      "startingPrice": 10.5,      "categories": [        {          "categoryRef": "string",          "v": 10.5        }      ],      "ticketTypes": [        {          "ticketTypeId": "string",          "v": 10.5        }      ],      "availabilityIndicator": "green"    }  ],  "ticketShopHeaderText": "string",  "tickets": [    {      "id": "string",      "v": 10.5,      "name": "string",      "price": 10.5,      "color": "string",      "description": "string",      "active": true,      "categoryRef": "string",      "requiresPersonalization": true,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "ignoreForMaxAmounts": true,      "conditionalAvailability": true,      "conditionalAvailabilityMode": "blockAddToCart",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "outerChargeFix": 10.5,      "innnerChargeFix": 10.5,      "dynamicFees": [        {}      ],      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "subscriptionSettings": {},      "priceTableTypeId": "string",      "meta": {},      "resellSettings": {        "enabled": "ENABLED"      }    }  ],  "resell": {    "saleActive": true,    "offerActive": true  }}
```

PUBLIC

## [Get more Events](https://docs.vivenu.dev/tickets#get-more-events)

#### Query

Get the info for a specific language

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```

## [The Public Event object](https://docs.vivenu.dev/tickets#the-public-event-object)

#### Attributes

An ISO timestamp indicating when the event starts

An ISO timestamp indicating when the event ends

#### Optional Attributes

Expand all

The ID of the seller owning this event

Custom key-value data. Metadata is useful for storing additional, structured information on an object.

The type of the event. SINGLE = it is a single event. GROUP = the event is part of a group of events

`SINGLE``GROUP``RECURRENCE``ROOT`

A description about the event. Description is in RichText - JSON format.

The page style of the event page

Style options of the event page

#### Optional Attributes

Expand all

styleOptions.headerStyle

Optional

string

Header style of the event page

styleOptions.brandOne

Optional

string

First brand of the event

styleOptions.brandTwo

Optional

string

Second brand of the event

styleOptions.hideLocationMap

Optional

boolean

Whether the location map on the event page hide

styleOptions.hideLocationAddress

Optional

boolean

Whether the location address on the event page hide

styleOptions.categoryAlignment

Optional

number float

The style of category alignment. 0 = cascade = categories among themselves. 1 = asTabs = categories as tabs. 2 = boxes = categories as boxes

styleOptions.showAvailabilityIndicator

Optional

boolean

Whether the availability indicator on the event page should be shown

styleOptions.availabilityIndicatorThresholds

Optional

array<number>

The availability indicator thresholds of the event

styleOptions.showAvailable

Optional

boolean

Whether to show availability of the time slot. Only applicable for time slot events.

The video settings of the event

#### Optional Attributes

Expand all

The youtube video ID of the event video setting

An array of gallery items of the event

The ID of the gallery item

#### Optional Attributes

Expand all

The title of the gallery item

gallery\[\].description

Optional

string

The description of the gallery item

gallery\[\].copyright

Optional

string

The copyright of the gallery item

The index of the gallery item

The image of the gallery item

checkinInformation

Optional

object

The checkin information of the event

checkinInformation.\_id

Required

string

The ID of the checkin information of the event

#### Optional Attributes

Expand all

checkinInformation.checkinStarts

Optional

string date-time

The date of when the checkin of the event starts

The accent color of the event page

An array of ticket types of the event

The ID of the ticket type of the event

The name of the ticket type of the event

The price of the ticket type of the event

The amount of the ticket type of the event

Whether the ticket type of the event is active

#### Optional Attributes

Expand all

tickets\[\].description

Optional

string

The description of the ticket type of the event

The image of the ticket type of the event

The font color of the ticket type of the event

tickets\[\].posActive

Optional

boolean

Whether POS for the ticket type of the event is active

tickets\[\].categoryRef

Optional

string

The reference of the category of the ticket type of the event

tickets\[\].ignoredForStartingPrice

Optional

boolean

Whether the price of the ticket type should be ignored on starting price determination of the event

tickets\[\].conditionalAvailability

Optional

boolean

Whether rules can be operated on the ticket type

tickets\[\].ticketBackground

Optional

string

The background for the ticket PDF of the ticket type

An array of rules for the ticket type of the event

tickets\[\].rules\[\].\_id

Required

string

The ID of the ticket type rule

tickets\[\].rules\[\].ticketGroup

Required

string

The ID of the ticket group to operate the rule on

tickets\[\].rules\[\].min

Required

number float

Minimum amount of tickets where the rule is active

tickets\[\].rules\[\].max

Required

number float

Maximum amount of tickets where the rule is active

tickets\[\].requiresPersonalization

Optional

Deprecated

boolean

Deprecated, use `requiresPersonalizationMode` instead

tickets\[\].requiresPersonalizationMode

Optional

string

Whether the ticket type of the event needs personalization

tickets\[\].requiresExtraFields

Optional

Deprecated

boolean

Deprecated, use `requiresExtraFieldsMode` instead

tickets\[\].requiresExtraFieldsMode

Optional

string

Whether the ticket type of the event needs extra fields

tickets\[\].repersonalizationFee

Optional

number float

The per-ticket fee for repersonalization.

tickets\[\].sortingKey

Optional

number float

The key to sort the ticket type within the ticket group

tickets\[\].enableHardTicketOption

Optional

boolean

Whether the ticket type is a hard ticket

tickets\[\].forceHardTicketOption

Optional

boolean

Whether to force the hard ticket option

tickets\[\].maxAmountPerOrder

Optional

number float

Maximum amount per order of the ticket type

tickets\[\].minAmountPerOrder

Optional

number float

Minimum amount per order of the ticket type

tickets\[\].minAmountPerOrderRule

Optional

number float

Minimum amount of the ticket type, where the minAmountPerOrder goes active

tickets\[\].taxRate

Optional

number float

The tax rate of the ticket type of the event

tickets\[\].styleOptions

Optional

object

Style options of the ticket type

#### Optional Attributes

Expand all

tickets\[\].styleOptions.thumbnailImage

Optional

string

Thumbnail of the ticket type, which will be displayed on checkout

tickets\[\].styleOptions.showAvailable

Optional

boolean

Whether to show availability of the ticket type

tickets\[\].styleOptions.hiddenInSelectionArea

Optional

boolean

Whether to show this ticket in the selection area

tickets\[\].priceCategoryId

Optional

string

The ID of the price category of the ticket type

tickets\[\].entryPermissions

Optional

array<string>

An array of IDs of entry permissions where the ticket buyer has access to certain areas

tickets\[\].ignoreForMaxAmounts

Optional

boolean

Do not include tickets if this typw when calculating available amount in categories and event

tickets\[\].expirationSettings

Optional

object

Expiration settings of the ticket type.

#### Optional Attributes

Expand all

tickets\[\].expirationSettings.enabled

Optional

boolean

Whether expiration enabled for the event ticket types

tickets\[\].expirationSettings.expiresAfter

Optional

object

If enabled = true. A relatve date specification until when ticket is valid.

tickets\[\].expirationSettings.expiresAfter.unit

Required

string

The unit in which the offset is specified

tickets\[\].expirationSettings.expiresAfter.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].expirationSettings.expiresAfter.target

Optional

string

The target of the relative date

tickets\[\].barcodePrefix

Optional

string

Characters that precede the barcodes of tickets.

tickets\[\].salesStart

Optional

object

A relative date before the end of the event, when the sale of this ticket type starts

tickets\[\].salesStart.unit

Required

string

The unit in which the offset is specified

tickets\[\].salesStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].salesStart.target

Optional

string

The target of the relative date

tickets\[\].salesEnd

Optional

object

A relative date before the end of the event, when the sale of this ticket type ends

tickets\[\].salesEnd.unit

Required

string

The unit in which the offset is specified

tickets\[\].salesEnd.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].salesEnd.target

Optional

string

The target of the relative date

tickets\[\].transferSettings

Optional

object

Transfer settings of the ticket type.

#### Optional Attributes

Expand all

tickets\[\].transferSettings.mode

Optional

string

Ticket transfer mode.

tickets\[\].transferSettings.expiresAfter

Optional

object

If 'mode = ALLOWED'. A relatve date specification until when ticket transfer is valid.

tickets\[\].transferSettings.expiresAfter.unit

Required

string

The unit in which the offset is specified

tickets\[\].transferSettings.expiresAfter.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].transferSettings.expiresAfter.target

Optional

string

The target of the relative date

tickets\[\].transferSettings.retransferMode

Optional

string

Ticket retransfer mode.

tickets\[\].transferSettings.allowedUntil

Optional

object

If 'mode = ALLOWED'. A relatve date specification until the end of the event where ticket transfer is possible.

tickets\[\].transferSettings.allowedUntil.unit

Required

string

The unit in which the offset is specified

tickets\[\].transferSettings.allowedUntil.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

tickets\[\].transferSettings.allowedUntil.target

Optional

string

The target of the relative date

tickets\[\].transferSettings.hardTicketsMode

Optional

string

If 'hardTicketsMode = ALLOWED' then hard tickets transfers allowed.

tickets\[\].scanSettings

Optional

object

Scan settings of the ticket type.

#### Optional Attributes

Expand all

tickets\[\].scanSettings.feedback

Optional

string

Feedback mode during scanning of the ticket

tickets\[\].deliverySettings

Optional

object

Delivery settings of the ticket type.

#### Optional Attributes

Expand all

tickets\[\].deliverySettings.wallet

Optional

object

#### Optional Attributes

Expand all

tickets\[\].deliverySettings.wallet.enabled

Optional

string

tickets\[\].deliverySettings.pdf

Optional

object

#### Optional Attributes

Expand all

tickets\[\].deliverySettings.pdf.enabled

Optional

string

Custom key-value data. Metadata is useful for storing additional, structured information on an object.

ticketExtraFields

Optional

array

An array of extra fields for ticket types of the event

ticketExtraFields\[\].\_id

Required

string

The ID of the extra field

ticketExtraFields\[\].required

Required

boolean

Whether the extra field is required

#### Optional Attributes

Expand all

ticketExtraFields\[\].name

Optional

string

The name of the extra field

ticketExtraFields\[\].description

Optional

string

The description of the extra field

ticketExtraFields\[\].collectInCheckout

Optional

boolean

Whether the extra field is collected in checkout

ticketExtraFields\[\].deleted

Optional

boolean

Whether the extra field is deleted

ticketExtraFields\[\].type

Optional

string

The type of the extra field. text = is a text field. number = is a number field. select = is a selection field of different selections. checkbox = is a checkbox field. tel = is a number field for a phone number. email = is a text field for an email. country = is a text field field for country.

`text``number``select``checkbox``tel``country``email``date``documentUpload``signature`

ticketExtraFields\[\].options

Optional

array<string>

An array of options of the extra field

ticketExtraFields\[\].onlyForCertainTicketTypes

Optional

boolean

Whether the extra field is only for certain ticket types

ticketExtraFields\[\].allowedTicketTypes

Optional

array<string>

An array of IDs of the ticket types allowed for the extra field

ticketExtraFields\[\].printable

Optional

boolean

Whether the extra field is printable

ticketExtraFields\[\].conditions

Optional

array

An array of conditions of the extra field. The conditions can refer to other extra fields.

ticketExtraFields\[\].conditions\[\].\_id

Required

string

The ID of the condition

ticketExtraFields\[\].conditions\[\].baseSlug

Required

string

The slug of the base extra field which the condition refers to

ticketExtraFields\[\].conditions\[\].value

Required

The value which the operator will be used on to check the condition.

One of

Only one of the following types

ticketExtraFields\[\].conditions\[\].operator

Required

string

The operator which will be used to check the condition

`equals``notEquals``greaterThan``lessThan``greaterThanOrEquals``lessThanOrEquals``exists``notExists`

The ticket design settings for ticket types of the event

The ID of the ticket types design of the event

#### Optional Attributes

Expand all

ticketDesign.useCustomDesign

Optional

boolean

Whether to use custom design on ticket types of event

ticketDesign.customDesignURL

Optional

string

The custom design URL for ticket types of event

ticketDesign.footerDesignURL

Optional

string

The footer design URL for ticket types of the event

ticketDesign.disclaimer

Optional

string

The disclaimer for ticket types of the event

ticketDesign.infoColor

Optional

string

The info color for ticket types of the event

ticketDesign.showTimeRange

Optional

boolean

Whether to show time range on ticket types of the event

ticketDesign.hideDates

Optional

boolean

Whether to hide dates on ticket types of the event

ticketDesign.hideTimes

Optional

boolean

Whether to hide the time on ticket types of the event

An array of extra fields of the event

extraFields\[\].\_id

Required

string

The ID of the extra field

extraFields\[\].required

Required

boolean

Whether the extra field is required

#### Optional Attributes

Expand all

extraFields\[\].name

Optional

string

The name of the extra field

extraFields\[\].description

Optional

string

The description of the extra field

extraFields\[\].collectInCheckout

Optional

boolean

Whether the extra field is collected in checkout

extraFields\[\].deleted

Optional

boolean

Whether the extra field is deleted

extraFields\[\].type

Optional

string

The type of the extra field. text = is a text field. number = is a number field. select = is a selection field of different selections. checkbox = is a checkbox field. tel = is a number field for a phone number. email = is a text field for an email. country = is a text field field for country.

`text``number``select``checkbox``tel``country``email``date``documentUpload``signature`

extraFields\[\].options

Optional

array<string>

An array of options of the extra field

extraFields\[\].onlyForCertainTicketTypes

Optional

boolean

Whether the extra field is only for certain ticket types

extraFields\[\].allowedTicketTypes

Optional

array<string>

An array of IDs of the ticket types allowed for the extra field

extraFields\[\].printable

Optional

boolean

Whether the extra field is printable

extraFields\[\].conditions

Optional

array

An array of conditions of the extra field. The conditions can refer to other extra fields.

extraFields\[\].conditions\[\].\_id

Required

string

The ID of the condition

extraFields\[\].conditions\[\].baseSlug

Required

string

The slug of the base extra field which the condition refers to

extraFields\[\].conditions\[\].value

Required

The value which the operator will be used on to check the condition.

One of

Only one of the following types

extraFields\[\].conditions\[\].operator

Required

string

The operator which will be used to check the condition

`equals``notEquals``greaterThan``lessThan``greaterThanOrEquals``lessThanOrEquals``exists``notExists`

Whether the countdown should be visible till event start

Whether other events should be displayed on the event page

hardTicketSettings

Optional

object

The hard ticket settings of the event

hardTicketSettings.\_id

Required

string

The ID of the event hard ticket settings

#### Optional Attributes

Expand all

hardTicketSettings.enabled

Optional

boolean

Whether hard tickets can be bought for this event

hardTicketSettings.fulfillmentType

Optional

string

The type of fulfillment. self fulfilled by the seller. managed fulfilled by vivenu.

hardTicketSettings.printingMethod

Optional

string

Which printing method is used. preprinted = The tickets are preprinted. adhoc = The tickets are printed ad-hoc.

hardTicketSettings.hardTicketOuterCharge

Optional

number float

Additional charge for every hard ticket that is added to the ticket price and the other outer charges - paid by the ticket buyer.

hardTicketSettings.hardTicketInnerCharge

Optional

number float

Additional charge for hard tickets as in the contract of the seller

hardTicketSettings.hardTicketPreviewURL

Optional

string

The hard ticket design image

hardTicketSettings.promotionName

Optional

string

A special name for hard tickets. e.g. "Collector edition"

hardTicketSettings.promotionText

Optional

string

A description about what makes this ticket so special

hardTicketSettings.requiredDays

Optional

integer

Required days until deliver of the hard tickets

The tracking of the event

#### Optional Attributes

Expand all

tracking.facebookPixel

Optional

object

The facebook pixel information of the event tracking

#### Optional Attributes

Expand all

tracking.facebookPixel.active

Optional

boolean

Whether facebook pixel of event tracking is active

tracking.facebookPixel.pixelId

Optional

string

The ID of facebook pixel of the event tracking

The tagging of the event tracking

#### Optional Attributes

Expand all

tracking.tagging.enabled

Optional

boolean

Whether tagging of event tracking is enabled

tracking.tagging.tags

Optional

array<string>

An array of tags of the event tracking

The search engine optimization settings of the event

The ID of the SEO setting

#### Optional Attributes

Expand all

An array of tags of the seo settings

seoSettings.noIndex

Optional

boolean

Whether the seo setting has no indexing

seoSettings.title

Optional

string

The title of the seo settings

seoSettings.description

Optional

string

The description of the seo settings

The sold out fallback of the event

soldOutFallback.\_id

Required

string

The ID of sold out entry

#### Optional Attributes

Expand all

soldOutFallback.soldOutFallbackType

Optional

string

`default``moreinformation``waitinglist`

soldOutFallback.soldOutFallbackLink

Optional

string

The link of the sold out fallback

reservationSettings

Optional

object

The reservation settings of event

reservationSettings.\_id

Required

string

The ID of the reservation setting

#### Optional Attributes

Expand all

reservationSettings.option

Optional

string

The option of the reservation setting. reservationsOnly = needs reservation only. noReservations = no reservations needed. reservationsAndPayment = needs reservation and payment

`noReservations``reservationsOnly``reservationsAndPayment``internalReservationsAndPayment`

reservationSettings.strategyId

Optional

string

The ID of the strategy of a purchase intents to be used on the event

The custom text configuration of the event

customTextConfig.\_id

Required

string

The ID of the custom text configuration

#### Optional Attributes

Expand all

customTextConfig.buyTicketsCTA

Optional

string

The custom CTA after buy tickets

The event ticket settings

#### Optional Attributes

Expand all

ticketSettings.cancellationStrategy

Optional

string

Cancellation strategy of the ticket types

ticketSettings.transferSettings

Optional

object

Transfer settings of the ticket types

#### Optional Attributes

Expand all

ticketSettings.transferSettings.mode

Optional

string

Ticket transfer mode.

ticketSettings.transferSettings.expiresAfter

Optional

object

If 'mode = ALLOWED'. A relatve date specification until when ticket transfer is valid.

ticketSettings.transferSettings.expiresAfter.unit

Required

string

The unit in which the offset is specified

ticketSettings.transferSettings.expiresAfter.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.transferSettings.expiresAfter.target

Optional

string

The target of the relative date

ticketSettings.transferSettings.retransferMode

Optional

string

Ticket retransfer mode.

ticketSettings.transferSettings.allowedUntil

Optional

object

If 'mode = ALLOWED'. A relatve date specification until the end of the event where ticket transfer is possible.

ticketSettings.transferSettings.allowedUntil.unit

Required

string

The unit in which the offset is specified

ticketSettings.transferSettings.allowedUntil.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.transferSettings.allowedUntil.target

Optional

string

The target of the relative date

ticketSettings.transferSettings.hardTicketsMode

Optional

string

If 'hardTicketsMode = ALLOWED' then hard tickets transfers allowed.

ticketSettings.upgradeSettings

Optional

object

Upgrade settings of the ticket types

#### Optional Attributes

Expand all

ticketSettings.upgradeSettings.enabled

Optional

string

Whether ticket upgrade settings enabled.

ticketSettings.upgradeSettings.underShopMapping

Optional

array

Mapping to define the under shop in which a ticket upgrade will be performed.

ticketSettings.upgradeSettings.underShopMapping\[\].type

Required

string

ticketSettings.upgradeSettings.underShopMapping\[\].tag

Required

string

The customer tag

ticketSettings.upgradeSettings.underShopMapping\[\].underShopId

Required

string

The ID of the under shop.

ticketSettings.resellSettings

Optional

object

Resell settings

#### Optional Attributes

Expand all

ticketSettings.resellSettings.enabled

Optional

string

Whether resell is enabled

ticketSettings.resellSettings.resellerFeeFix

Optional

number float

The fix resellers fee.

ticketSettings.resellSettings.resellerFeeVar

Optional

number float

The variable resellers fee.

ticketSettings.resellSettings.offerCreationStart

Optional

object

A relative date specification of offers creation start.

ticketSettings.resellSettings.offerCreationStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationStart.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.offerCreationEnd

Optional

object

A relative date specification of offers creation end.

ticketSettings.resellSettings.offerCreationEnd.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationEnd.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationEnd.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.salesStart

Optional

object

A relative date specification of sales start.

ticketSettings.resellSettings.salesStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.salesStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.salesStart.target

Optional

string

The target of the relative date

ticketSettings.barcodeSettings

Optional

object

Barcode settings

#### Optional Attributes

Expand all

ticketSettings.barcodeSettings.issueOfflineBarcodes

Optional

string

Whether offline barcodes are enabled

ticketSettings.childEventMapping

Optional

array

Child event mapping

ticketSettings.childEventMapping\[\].childEventId

Required

string

The child event for this mapping

ticketSettings.childEventMapping\[\].ticketTypeMapping

Required

object

Mapping between ticket types of the parent event and the child events

#### Optional Attributes

Expand all

ticketSettings.childEventMapping\[\].valueShare

Optional

number float

The percentage value of this child event from the value of the parent event

ticketSettings.seasonCardValueStrategy

Optional

string

The strategy used to determine the value of a child event in the context of the parent event

`childValue``averagePerChild``sharePerChild`

Custom settings of the event

customSettings.\_id

Required

string

The ID of the custom settings of the event

#### Optional Attributes

Expand all

customSettings.hideTicketsInTransactionPage

Optional

boolean

Whether the ticket types of the event should be visible on transaction page

customSettings.dontSendTicketMail

Optional

boolean

Whether an email should be sent of tickets of the event

customSettings.dontSendBookingConfirmationMail

Optional

boolean

Whether an email should be sent for booking confirmation

customSettings.customMailHeaderImage

Optional

string

A custom header image of the mail for ticket types of the event

customSettings.customTransactionCompletionText

Optional

string

A custom transaction completion text for completed transactions of the event

customSettings.disableAppleWallet

Optional

Deprecated

boolean

Whether the Apple and Google Wallet functionality should be disabled on the event. Deprecated: use event.deliverySettings.wallet instead

customSettings.disablePdfTickets

Optional

Deprecated

boolean

Whether the PDF tickets download functionality should be disabled on the event. Deprecated: use event.deliverySettings.pdf instead

customSettings.showStartDate

Optional

boolean

Whether the start date of the event should be visible on listings

customSettings.showStartTime

Optional

boolean

Whether the start time of the event should be visible on listings

customSettings.showEndDate

Optional

boolean

Whether the end date of the event should be visible on listings

customSettings.showEndTime

Optional

boolean

Whether the end time of the event should be visible on listings

customSettings.showTimeRangeInListing

Optional

Deprecated

boolean

Whether the end time of the event should be visible on listings

customSettings.showTimeRangeInTicket

Optional

boolean

Whether the time range of the event should be visible on ticket PDFs

customSettings.customCheckoutCSS

Optional

string

Custom CSS styling of the checkout of the event

customSettings.useCustomCheckoutBrand

Optional

boolean

Whether the checkout of the event should use custom brand

customSettings.customCheckoutBrand

Optional

string

A custom checkout brand of the event

customSettings.hideLogoInCheckout

Optional

boolean

Whether the logo should be hide on the checkout of the event

customSettings.customEventPageHTML

Optional

string

A custom HTML of the event page

customSettings.customEventPageCSS

Optional

string

A custom css styling of the event page

customSettings.customConfirmationPage

Optional

string

A custom css styling of the event page

customSettings.hideSeatmapInCheckout

Optional

boolean

Hides the seatmap from the ticket buyer even if seating ticket types are available

customSettings.dontSendBookingConfirmationSMS

Optional

boolean

Whether a sms should be sent for booking confirmation

The upsell settings of the event

upsellSettings.\_id

Required

string

The ID of the upsell settings of the event

#### Optional Attributes

Expand all

upsellSettings.active

Optional

boolean

Whether upselling is active on the event

upsellSettings.productStream

Optional

string

The product stream for upselling

upsellSettings.headerImage

Optional

string

A header image for the ticket shop, when selecting products

upsellSettings.crossSells

Optional

object

The cross selling settings.

#### Optional Attributes

Expand all

upsellSettings.crossSells.eventIds

Optional

array<string>

The array of the promoted event IDs.

The category of the extra information of the event

The subCategory of the extra information of the event

showTimeRangeInTicket

Optional

boolean

Whether the time range of the event should be visible on ticket PDFs

showTimeRangeInListing

Optional

Deprecated

boolean

Whether the end time of the event should be visible on listings

Whether the start date of the event should be visible on listings

Whether the start time of the event should be visible on listings

Whether the end date of the event should be visible on listings

Whether the end time of the event should be visible on listings

accountSettings.\_id

Required

string

The ID of the account settings of the event

#### Optional Attributes

Expand all

accountSettings.enforceAccounts

Optional

Deprecated

boolean

Whether to enforce accounts for the event

accountSettings.enforceAuthentication

Optional

string

Whether to enforce authentication for the event and how to enforce it

`DISABLED``PREVENT_CHECKOUT``PREVENT_DETAILS_STEP`

#### Optional Attributes

Expand all

location.locationName

Optional

string

The name of the location where the event takes place

location.locationStreet

Optional

string

The street of the location where the event takes place

location.locationCity

Optional

string

The city of the location where the event takes place

location.locationPostal

Optional

string

The postal code of the location where the event takes place

location.locationCountry

Optional

string

The country code of the location where the event takes place

The geographic code of the event

location.geoCode.\_id

Required

string

The ID of the geo code

location.geoCode.lat

Required

number float

Latitude coordinate of the geo code

location.geoCode.lng

Required

number float

Longitude coordinate of the geo code

#### Optional Attributes

Expand all

resell.saleActive

Optional

boolean

Whether the event has buying from the secondary market active.

resell.offerActive

Optional

boolean

Whether the event has selling on the secondary market active.

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "meta": {},  "eventType": "SINGLE",  "name": "string",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "url": "string",  "slogan": "string",  "description": "string",  "image": "string",  "pageStyle": "white",  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "video": {    "youtubeID": "string"  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "accentColor": "#006DCC",  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "showCountdown": true,  "showOtherEvents": true,  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "reservationSettings": {    "option": "noReservations"  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "timezone": "string",  "ticketSettings": {},  "rootId": "string",  "customSettings": {},  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "category": "string",  "subCategory": "string",  "showTimeRangeInTicket": true,  "showTimeRangeInListing": true,  "showStartDate": true,  "showStartTime": true,  "showEndDate": true,  "showEndTime": true,  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "location": {    "locationName": "string",    "locationStreet": "string",    "locationCity": "string",    "locationPostal": "string",    "locationCountry": "string",    "geoCode": {      "_id": "string",      "lat": 10.5,      "lng": 10.5    }  },  "resell": {    "saleActive": true,    "offerActive": true  }}
```

PUBLIC

## [Get Public Event](https://docs.vivenu.dev/tickets#get-public-event)

#### Query

Get the event for a specific language

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "meta": {},  "eventType": "SINGLE",  "name": "string",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "url": "string",  "slogan": "string",  "description": "string",  "image": "string",  "pageStyle": "white",  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "video": {    "youtubeID": "string"  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "accentColor": "#006DCC",  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "showCountdown": true,  "showOtherEvents": true,  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "reservationSettings": {    "option": "noReservations"  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "timezone": "string",  "ticketSettings": {},  "rootId": "string",  "customSettings": {},  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "category": "string",  "subCategory": "string",  "showTimeRangeInTicket": true,  "showTimeRangeInListing": true,  "showStartDate": true,  "showStartTime": true,  "showEndDate": true,  "showEndTime": true,  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "location": {    "locationName": "string",    "locationStreet": "string",    "locationCity": "string",    "locationPostal": "string",    "locationCountry": "string",    "geoCode": {      "_id": "string",      "lat": 10.5,      "lng": 10.5    }  },  "resell": {    "saleActive": true,    "offerActive": true  }}
```

## [The Public Listing Event object](https://docs.vivenu.dev/tickets#the-public-listing-event-object)

You can retrieve a list of public listing event objects with the Get public listings events endpoint. This API provides information about your public listing events.

#### Attributes

An ISO timestamp indicating when the event starts

An ISO timestamp indicating when the event ends

#### Optional Attributes

Expand all

The ID of the seller owning this event

The name of the location where the event takes place

The street of the location where the event takes place

The city of the location where the event takes place

The postal code of the location where the event takes place

The country code of the location where the event takes place

Style options of the event page

#### Optional Attributes

Expand all

styleOptions.headerStyle

Optional

string

Header style of the event page

styleOptions.brandOne

Optional

string

First brand of the event

styleOptions.brandTwo

Optional

string

Second brand of the event

styleOptions.hideLocationMap

Optional

boolean

Whether the location map on the event page hide

styleOptions.hideLocationAddress

Optional

boolean

Whether the location address on the event page hide

styleOptions.categoryAlignment

Optional

number float

The style of category alignment. 0 = cascade = categories among themselves. 1 = asTabs = categories as tabs. 2 = boxes = categories as boxes

styleOptions.showAvailabilityIndicator

Optional

boolean

Whether the availability indicator on the event page should be shown

styleOptions.availabilityIndicatorThresholds

Optional

array<number>

The availability indicator thresholds of the event

styleOptions.showAvailable

Optional

boolean

Whether to show availability of the time slot. Only applicable for time slot events.

Account settings of the event

accountSettings.\_id

Required

string

The ID of the account settings of the event

#### Optional Attributes

Expand all

accountSettings.enforceAccounts

Optional

Deprecated

boolean

Whether to enforce accounts for the event

accountSettings.enforceAuthentication

Optional

string

Whether to enforce authentication for the event and how to enforce it

`DISABLED``PREVENT_CHECKOUT``PREVENT_DETAILS_STEP`

Custom key-value data. Metadata is useful for storing additional, structured information on an object.

The type of the event. SINGLE = it is a single event. GROUP = the event is part of a group of events

`SINGLE``GROUP``RECURRENCE``ROOT`

An array of IDs of child events

The ID of the day scheme assigned to the event.

The search engine optimization settings of the event

The ID of the SEO setting

#### Optional Attributes

Expand all

An array of tags of the seo settings

seoSettings.noIndex

Optional

boolean

Whether the seo setting has no indexing

seoSettings.title

Optional

string

The title of the seo settings

seoSettings.description

Optional

string

The description of the seo settings

Custom settings of the event

customSettings.\_id

Required

string

The ID of the custom settings of the event

#### Optional Attributes

Expand all

customSettings.hideTicketsInTransactionPage

Optional

boolean

Whether the ticket types of the event should be visible on transaction page

customSettings.dontSendTicketMail

Optional

boolean

Whether an email should be sent of tickets of the event

customSettings.dontSendBookingConfirmationMail

Optional

boolean

Whether an email should be sent for booking confirmation

customSettings.customMailHeaderImage

Optional

string

A custom header image of the mail for ticket types of the event

customSettings.customTransactionCompletionText

Optional

string

A custom transaction completion text for completed transactions of the event

customSettings.disableAppleWallet

Optional

Deprecated

boolean

Whether the Apple and Google Wallet functionality should be disabled on the event. Deprecated: use event.deliverySettings.wallet instead

customSettings.disablePdfTickets

Optional

Deprecated

boolean

Whether the PDF tickets download functionality should be disabled on the event. Deprecated: use event.deliverySettings.pdf instead

customSettings.showStartDate

Optional

boolean

Whether the start date of the event should be visible on listings

customSettings.showStartTime

Optional

boolean

Whether the start time of the event should be visible on listings

customSettings.showEndDate

Optional

boolean

Whether the end date of the event should be visible on listings

customSettings.showEndTime

Optional

boolean

Whether the end time of the event should be visible on listings

customSettings.showTimeRangeInListing

Optional

Deprecated

boolean

Whether the end time of the event should be visible on listings

customSettings.showTimeRangeInTicket

Optional

boolean

Whether the time range of the event should be visible on ticket PDFs

customSettings.customCheckoutCSS

Optional

string

Custom CSS styling of the checkout of the event

customSettings.useCustomCheckoutBrand

Optional

boolean

Whether the checkout of the event should use custom brand

customSettings.customCheckoutBrand

Optional

string

A custom checkout brand of the event

customSettings.hideLogoInCheckout

Optional

boolean

Whether the logo should be hide on the checkout of the event

customSettings.customEventPageHTML

Optional

string

A custom HTML of the event page

customSettings.customEventPageCSS

Optional

string

A custom css styling of the event page

customSettings.customConfirmationPage

Optional

string

A custom css styling of the event page

customSettings.hideSeatmapInCheckout

Optional

boolean

Hides the seatmap from the ticket buyer even if seating ticket types are available

customSettings.dontSendBookingConfirmationSMS

Optional

boolean

Whether a sms should be sent for booking confirmation

The event ticket settings

#### Optional Attributes

Expand all

ticketSettings.cancellationStrategy

Optional

string

Cancellation strategy of the ticket types

ticketSettings.transferSettings

Optional

object

Transfer settings of the ticket types

#### Optional Attributes

Expand all

ticketSettings.transferSettings.mode

Optional

string

Ticket transfer mode.

ticketSettings.transferSettings.expiresAfter

Optional

object

If 'mode = ALLOWED'. A relatve date specification until when ticket transfer is valid.

ticketSettings.transferSettings.expiresAfter.unit

Required

string

The unit in which the offset is specified

ticketSettings.transferSettings.expiresAfter.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.transferSettings.expiresAfter.target

Optional

string

The target of the relative date

ticketSettings.transferSettings.retransferMode

Optional

string

Ticket retransfer mode.

ticketSettings.transferSettings.allowedUntil

Optional

object

If 'mode = ALLOWED'. A relatve date specification until the end of the event where ticket transfer is possible.

ticketSettings.transferSettings.allowedUntil.unit

Required

string

The unit in which the offset is specified

ticketSettings.transferSettings.allowedUntil.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.transferSettings.allowedUntil.target

Optional

string

The target of the relative date

ticketSettings.transferSettings.hardTicketsMode

Optional

string

If 'hardTicketsMode = ALLOWED' then hard tickets transfers allowed.

ticketSettings.upgradeSettings

Optional

object

Upgrade settings of the ticket types

#### Optional Attributes

Expand all

ticketSettings.upgradeSettings.enabled

Optional

string

Whether ticket upgrade settings enabled.

ticketSettings.upgradeSettings.underShopMapping

Optional

array

Mapping to define the under shop in which a ticket upgrade will be performed.

ticketSettings.upgradeSettings.underShopMapping\[\].type

Required

string

ticketSettings.upgradeSettings.underShopMapping\[\].tag

Required

string

The customer tag

ticketSettings.upgradeSettings.underShopMapping\[\].underShopId

Required

string

The ID of the under shop.

ticketSettings.resellSettings

Optional

object

Resell settings

#### Optional Attributes

Expand all

ticketSettings.resellSettings.enabled

Optional

string

Whether resell is enabled

ticketSettings.resellSettings.resellerFeeFix

Optional

number float

The fix resellers fee.

ticketSettings.resellSettings.resellerFeeVar

Optional

number float

The variable resellers fee.

ticketSettings.resellSettings.offerCreationStart

Optional

object

A relative date specification of offers creation start.

ticketSettings.resellSettings.offerCreationStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationStart.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.offerCreationEnd

Optional

object

A relative date specification of offers creation end.

ticketSettings.resellSettings.offerCreationEnd.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.offerCreationEnd.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.offerCreationEnd.target

Optional

string

The target of the relative date

ticketSettings.resellSettings.salesStart

Optional

object

A relative date specification of sales start.

ticketSettings.resellSettings.salesStart.unit

Required

string

The unit in which the offset is specified

ticketSettings.resellSettings.salesStart.offset

Required

integer

The offset to the date

#### Optional Attributes

Expand all

ticketSettings.resellSettings.salesStart.target

Optional

string

The target of the relative date

ticketSettings.barcodeSettings

Optional

object

Barcode settings

#### Optional Attributes

Expand all

ticketSettings.barcodeSettings.issueOfflineBarcodes

Optional

string

Whether offline barcodes are enabled

ticketSettings.childEventMapping

Optional

array

Child event mapping

ticketSettings.childEventMapping\[\].childEventId

Required

string

The child event for this mapping

ticketSettings.childEventMapping\[\].ticketTypeMapping

Required

object

Mapping between ticket types of the parent event and the child events

#### Optional Attributes

Expand all

ticketSettings.childEventMapping\[\].valueShare

Optional

number float

The percentage value of this child event from the value of the parent event

ticketSettings.seasonCardValueStrategy

Optional

string

The strategy used to determine the value of a child event in the context of the parent event

`childValue``averagePerChild``sharePerChild`

The ID of the under shop of the event

The starting price of the event

Whether to show the start time of the event in listings or not

Whether to show the end time of the event in listings or not

showTimeRangeInListing

Optional

Deprecated

boolean

Whether to show the end time of the event in listings or not

availabilityIndicator

Optional

string

The availability of the event. It shows whether there are tickets available. green = Enough available tickets. yellow = The tickets are almost sold out. red = There are no more available tickets

The currency of event tickets prices

`EUR``USD``GBP``AUD``CHF``THB``ILS``COP``MXN``DKK``NOK``SEK``QAR``CAD``ISK``GTQ``INR``DOP``SGD``PLN``SAR``TTD``ZAR``KYD``HKD``CZK``KRW``JPY``NZD``AED``MAD``TWD``BRL``BWP``NAD`

#### Optional Attributes

Expand all

resell.saleActive

Optional

boolean

Whether the event has buying from the secondary market active.

resell.offerActive

Optional

boolean

Whether the event has selling on the secondary market active.

Was this section helpful?

YesNo

```
{  "_id": "string",  "url": "string",  "name": "string",  "image": "string",  "slogan": "string",  "sellerId": "string",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "meta": {},  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "daySchemeId": "string",  "rootId": "string",  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "customSettings": {},  "ticketSettings": {},  "underShopId": "string",  "startingPrice": "string",  "showStartDate": true,  "showEndDate": true,  "showTimeRangeInListing": true,  "availabilityIndicator": "green",  "currency": "EUR",  "saleStatus": "onSale",  "timezone": "string",  "category": "string",  "subCategory": "string",  "resell": {    "saleActive": true,    "offerActive": true  }}
```

PUBLIC

## [Get public listing events](https://docs.vivenu.dev/tickets#get-public-listing-events)

#### Query

One of

Only one of the following types

Get the info for a specific language

Was this section helpful?

YesNo

```
[  {    "_id": "string",    "url": "string",    "name": "string",    "image": "string",    "slogan": "string",    "sellerId": "string",    "start": "2030-01-23T23:00:00.123Z",    "end": "2030-01-23T23:00:00.123Z",    "locationName": "string",    "locationStreet": "string",    "locationCity": "string",    "locationPostal": "string",    "locationCountry": "string",    "styleOptions": {      "headerStyle": "default",      "hideLocationMap": false,      "hideLocationAddress": false,      "categoryAlignment": 0,      "showAvailabilityIndicator": false,      "availabilityIndicatorThresholds": [        0.3,        0.7      ]    },    "accountSettings": {      "_id": "string",      "enforceAccounts": true,      "enforceAuthentication": "DISABLED"    },    "meta": {},    "eventType": "SINGLE",    "childEvents": [      "string"    ],    "daySchemeId": "string",    "rootId": "string",    "seoSettings": {      "_id": "string",      "tags": [        "string"      ],      "noIndex": true,      "title": "string",      "description": "string"    },    "customSettings": {},    "ticketSettings": {},    "underShopId": "string",    "startingPrice": "string",    "showStartDate": true,    "showEndDate": true,    "showTimeRangeInListing": true,    "availabilityIndicator": "green",    "currency": "EUR",    "saleStatus": "onSale",    "timezone": "string",    "category": "string",    "subCategory": "string",    "resell": {      "saleActive": true,      "offerActive": true    }  }]
```

## [Add Recurrences](https://docs.vivenu.dev/tickets#add-recurrences)

#### Payload

One of

Only one of the following types

#### Optional Attributes

Expand all

sellDatesStrategy

Optional

string

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

One of

Only one of the following types

checkinStartOffset

Optional

integer

Was this section helpful?

YesNo

```
{  "every": 1,  "unit": "WEEK",  "from": "2030-01-23T23:00:00.123Z",  "to": "2030-01-23T23:00:00.123Z",  "startTime": "2030-01-23T23:00:00.123Z",  "endTime": "2030-01-23T23:00:00.123Z",  "sellDatesStrategy": "RELATIVE",  "sellStartAt": [],  "sellEndAt": [],  "sellStartOffset": [],  "sellEndOffset": [],  "sellStartTime": [],  "sellEndTime": [],  "checkinStartOffset": 1,  "checkinStartTime": "2030-01-23T23:00:00.123Z",  "daySchemeId": "string",  "priceTableTierId": "string",  "repeatsOn": [    "string"  ]}
```

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```

## [Decouple event](https://docs.vivenu.dev/tickets#decouple-event)

#### Query

No supported query parameters

Was this section helpful?

YesNo

```
{  "_id": "string",  "sellerId": "string",  "name": "string",  "slogan": "string",  "description": "string",  "locationName": "string",  "locationStreet": "string",  "locationCity": "string",  "locationPostal": "string",  "locationCountry": "string",  "image": "string",  "ticketFooter": "string",  "ticketBackground": "string",  "ticketShopHeader": "string",  "groups": [    {      "_id": "string",      "name": "string",      "tickets": [        "string"      ]    }  ],  "discountGroups": [    {      "_id": "string",      "name": "string",      "rules": [        {          "_id": "string",          "group": "string",          "type": "ticketGroups",          "min": 10.5,          "max": 10.5        }      ],      "discountType": "fix",      "value": 10.5    }  ],  "cartAutomationRules": [    {      "_id": "string",      "name": "string",      "triggerType": "hasBeenAdded",      "triggerTargetGroup": "string",      "thenType": "autoAdd",      "thenTargets": [        {          "_id": "string",          "thenTargetGroup": "string",          "thenTargetMin": 10.5,          "thenTargetMax": 10.5        }      ]    }  ],  "posDiscounts": [    {      "_id": "string",      "name": "string",      "discountType": "fix",      "value": 10.5    }  ],  "categories": [    {      "_id": "string",      "name": "string",      "description": "string",      "seatingReference": "string",      "ref": "string",      "amount": 10.5,      "recommendedTicket": "string",      "maxAmountPerOrder": 10.5,      "listWithoutSeats": true    }  ],  "tickets": [    {      "_id": "string",      "name": "string",      "description": "string",      "image": "string",      "color": "string",      "price": 10.5,      "amount": 10.5,      "active": true,      "posActive": true,      "categoryRef": "string",      "ignoredForStartingPrice": true,      "conditionalAvailability": true,      "ticketBackground": "string",      "rules": [        {          "_id": "string",          "ticketGroup": "string",          "min": 10.5,          "max": 10.5        }      ],      "requiresPersonalization": true,      "requiresPersonalizationMode": "ENABLED",      "requiresExtraFields": true,      "requiresExtraFieldsMode": "ENABLED",      "repersonalizationFee": 10.5,      "sortingKey": 10.5,      "enableHardTicketOption": true,      "forceHardTicketOption": true,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 10.5,      "minAmountPerOrderRule": 10.5,      "taxRate": 10.5,      "styleOptions": {},      "priceCategoryId": "string",      "entryPermissions": [],      "ignoreForMaxAmounts": true,      "expirationSettings": {},      "barcodePrefix": "string",      "salesStart": {        "target": "string",        "unit": "hours",        "offset": 1      },      "salesEnd": {        "target": "string",        "unit": "hours",        "offset": 1      },      "transferSettings": {},      "scanSettings": {        "feedback": "highlight"      },      "deliverySettings": {        "wallet": {          "enabled": "ENABLED"        },        "pdf": {          "enabled": "ENABLED"        }      },      "meta": {}    }  ],  "createdAt": "2030-01-23T23:00:00.123Z",  "updatedAt": "2030-01-23T23:00:00.123Z",  "start": "2030-01-23T23:00:00.123Z",  "end": "2030-01-23T23:00:00.123Z",  "sellStart": "2030-01-23T23:00:00.123Z",  "sellEnd": "2030-01-23T23:00:00.123Z",  "maxAmount": 10.5,  "maxAmountPerOrder": 10.5,  "maxAmountPerCustomer": 10.5,  "maxTransactionsPerCustomer": 10.5,  "minAmountPerOrder": 1,  "customerTags": [],  "customerSegments": [],  "showCountdown": true,  "hideInListing": true,  "visibleAfter": "2030-01-23T23:00:00.123Z",  "customSettings": {},  "extraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "ticketExtraFields": [    {      "_id": "string",      "name": "string",      "description": "string",      "required": true,      "collectInCheckout": true,      "deleted": true,      "type": "text",      "options": [        "string"      ],      "onlyForCertainTicketTypes": true,      "allowedTicketTypes": [],      "printable": true,      "conditions": [        {          "_id": "string",          "baseSlug": "string",          "value": [],          "operator": "equals"        }      ]    }  ],  "accentColor": "#006DCC",  "pageStyle": "white",  "showOtherEvents": true,  "underShops": [    {      "_id": "string",      "name": "string",      "active": true,      "tickets": [        {          "_id": "string",          "baseTicket": "string",          "name": "string",          "description": "string",          "price": 10.5,          "amount": 10.5,          "active": true        }      ],      "sellStart": "2030-01-23T23:00:00.123Z",      "sellEnd": "2030-01-23T23:00:00.123Z",      "maxAmount": 10.5,      "maxAmountPerOrder": 10.5,      "minAmountPerOrder": 1,      "maxTransactionsPerCustomer": 10.5,      "maxAmountPerCustomer": 10.5,      "ticketShopHeaderText": "string",      "customCharges": {},      "seatingContingents": [        "string"      ],      "availabilityMode": "default",      "bestAvailableSeatingConfiguration": {        "enabled": true,        "enforced": true,        "allowMassBooking": true      },      "reservationSettings": {        "option": "noReservations"      },      "accountSettings": {        "_id": "string",        "enforceAccounts": true,        "enforceAuthentication": "DISABLED"      },      "customerTags": [],      "customerSegments": [],      "allowMassDownload": true,      "inventoryStrategy": "independent",      "extraFields": [        {          "_id": "string",          "name": "string",          "description": "string",          "required": true,          "collectInCheckout": true,          "deleted": true,          "type": "text",          "options": [            "string"          ],          "onlyForCertainTicketTypes": true,          "allowedTicketTypes": [],          "printable": true,          "conditions": [            {              "_id": "string",              "baseSlug": "string",              "value": [],              "operator": "equals"            }          ]        }      ],      "salesChannelGroupSettings": [        {          "salesChannelGroupId": "string"        }      ],      "paymentSettings": {        "paymentStrategyId": "string"      },      "unlockMode": "none"    }  ],  "seating": {    "_id": "string",    "active": true,    "eventKey": "string",    "eventId": "string",    "seatMapId": "string",    "revisionId": "string",    "orphanConfiguration": {      "_id": "string",      "minSeatDistance": 2,      "edgeSeatsOrphaning": true    },    "contingents": [      "string"    ],    "availabilityMode": "default",    "bestAvailableSeatingConfiguration": {      "enabled": true,      "enforced": true    }  },  "customTextConfig": {    "_id": "string",    "buyTicketsCTA": "string"  },  "eventType": "SINGLE",  "childEvents": [    "string"  ],  "url": "string",  "tags": [    "string"  ],  "seoSettings": {    "_id": "string",    "tags": [      "string"    ],    "noIndex": true,    "title": "string",    "description": "string"  },  "extraInformation": {    "_id": "string",    "type": "string",    "category": "string",    "subCategory": "string"  },  "customCharges": {    "_id": "string",    "outerChargeVar": 10.5,    "innerChargeVar": 10.5,    "outerChargeFix": 10.5,    "innerChargeFix": 10.5,    "posOuterChargeFix": 10.5,    "posOuterChargeVar": 10.5,    "cartOuterChargeFix": 10.5  },  "gallery": [    {      "_id": "string",      "title": "string",      "description": "string",      "copyright": "string",      "index": 10.5,      "image": "string"    }  ],  "video": {    "youtubeID": "string"  },  "soldOutFallback": {    "_id": "string",    "soldOutFallbackType": "default",    "soldOutFallbackLink": "string"  },  "ticketDesign": {    "_id": "string",    "useCustomDesign": true,    "customDesignURL": "string",    "footerDesignURL": "string",    "disclaimer": "string",    "infoColor": "string",    "showTimeRange": true,    "hideDates": true,    "hideTimes": true  },  "checkinInformation": {    "_id": "string",    "checkinStarts": "2030-01-23T23:00:00.123Z"  },  "tracking": {    "facebookPixel": {      "active": true,      "pixelId": "string"    },    "tagging": {      "enabled": true,      "tags": [        "string"      ]    }  },  "hardTicketSettings": {    "_id": "string",    "enabled": true,    "fulfillmentType": "self",    "printingMethod": "preprinted",    "hardTicketOuterCharge": 10.5,    "hardTicketInnerCharge": 10.5,    "hardTicketPreviewURL": "string",    "promotionName": "string",    "promotionText": "string",    "requiredDays": 1  },  "dataRequestSettings": {    "requiresPersonalization": false,    "requiresExtraFields": false,    "repersonalization": false,    "posPersonalization": "noPersonalization"  },  "styleOptions": {    "headerStyle": "default",    "hideLocationMap": false,    "hideLocationAddress": false,    "categoryAlignment": 0,    "showAvailabilityIndicator": false,    "availabilityIndicatorThresholds": [      0.3,      0.7    ]  },  "geoCode": {    "_id": "string",    "lat": 10.5,    "lng": 10.5  },  "accountSettings": {    "_id": "string",    "enforceAccounts": true,    "enforceAuthentication": "DISABLED"  },  "reservationSettings": {    "option": "noReservations"  },  "upsellSettings": {    "_id": "string",    "active": true,    "productStream": "string",    "headerImage": "string",    "crossSells": {      "eventIds": [        "string"      ]    }  },  "repetitionSettings": [    {      "every": 10.5,      "unit": "DAY",      "repeatsOn": [        "SUNDAY"      ],      "from": "2030-01-23T23:00:00.123Z",      "to": "2030-01-23T23:00:00.123Z"    }  ],  "rootId": "string",  "daySchemes": [    {      "_id": "string",      "name": "string",      "color": "string",      "offers": {}    }  ],  "daySchemeId": "string",  "ticketSettings": {},  "accessListMapping": [    {      "listId": "string",      "ticketTypeId": "string"    }  ],  "deliverySettings": {    "wallet": {      "enabled": "ENABLED",      "nfc": "ENABLED",      "seasonCardShowNextEvent": true    },    "pdf": {      "enabled": "ENABLED"    }  },  "meta": {},  "timezone": "string",  "salesChannelGroupSettings": [    {      "salesChannelGroupId": "string"    }  ],  "paymentSettings": {    "paymentStrategyId": "string"  },  "timeSlots": [    {      "_id": "string",      "startTime": {        "hour": 1,        "minute": 1      },      "refs": [        {          "refType": "category",          "categoryRef": "string"        }      ],      "amount": 10.5    }  ],  "useTimeSlots": true,  "attributes": {}}
```