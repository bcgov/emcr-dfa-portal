## Generate Entities

### Version
As of June 24, 2025; this is the latest version. 
For more examples:
- [CAS Adapter](https://github.com/bcgov/cas-adapter) -> Example using repository directly, latest code and Database\README.md 
- [Victim Services VSD](https://github.com/bcgov/pssg-cscp-vsd)	-> Example using command pattern, latest command code in folder "Manager"
- [CPU](https://github.com/bcgov/pssg-cscp-cpu) -> Older but more recent than ECER
- [ECER](https://github.com/bcgov/ECC-ECER) -> Original Dataverse code that above were based on. Has IConfigureComponents for wiring up dependencies using reflection
								-> Document non-discoverable code e.g. code by convention ^^

### Overview
This Database project uses the latest standard of using Dynamics as a database and exposing ORM entities for use with repositories and command handlers
The advantages of this new standard are:
- Higher performance especially with nested queries which are no longer N^2 queries
- Strongly typed queries
- Compatible with repository or command handler patterns e.g. MediatR


### Prerequisites
- [XrmToolbox](https://www.xrmtoolbox.com/) with [Early Bound Generator V2 plugin](https://www.xrmtoolbox.com/plugins/DLaB.Xrm.EarlyBoundGeneratorV2/)
Download the latest version on the XrmToolbox home page. To install the plugin, open XrmToolbox, click on "Configuration -> Tool Library" and search for "Early Bound Generator V2" and install it.
You can also use Tool Library to update the existing plugins.
- Cisco vpn.gov.bc.ca connection


### Project Structure
- EMBC.Database: DatabaseContext and all the entities, messages, and optionsets; for the configured Dynamics database
- EMBC.Database.Contract: DTOs, enums, and other shared types used by the Manager project
- EMBC.Database.Resources: Repositories, mappers, and services needed to access the database
- EMBC.Database.Shared.Contract: Common utility classes and interfaces for all dataverse solutions
- EMBC.Database.Shared.Database: Common database code for all dataverse solutions e.g. generic repository, common mappers, extensions


### Connect to Database
You can use the Wizard or Connection String options to add a new connection
To use Wizard connection setup, select "Connection Wizard" option, 
- paste the Dynamics odata base url e.g. https://jsb-fams.dev.jag.gov.bc.ca, uncheck "Use your current credentials", and click "Next"
- "Are you connecting to an Internet Facing Deployment organization" select Yes and click "Next"
- Enter your IDIR username and Password and click "Next". NOTE you may need to enter domain "IDIR" if you are using a service account, check "Save password ..."
To use "Connection String", select "Connection String", and then add the following connection string replacing the placeholders with your IDIR login:
`authtype=AD;url=https://cscp-vs.dev.jag.gov.bc.ca;domain=https://ststest.gov.bc.ca/adfs/oauth2/token;username=<idir_username>@gov.bc.ca;password=<password>`


### Setup new database project for a new solution
1. Add a new class library project to your .NET solution e.g. "Database"
2. See below on how to create a new connection
3. Open XrmToolBox -> Tool "Early Bound Generator V2" and save the default settings to the project folder
4. Select "Entities Whitelist" and select the tables you will be need to access in the solution
5. Set "Namespace" -> "Database.Model", "Output Relative Directory" -> "Model", and "Service Context Name" -> "DatabaseContext"
6. Click "Generate" to generate the entities, messages, optionsets in their corresponding folders and DatabaseContext.
7. Copy "Shared.Contract" and "Shared.Database" folders and file "Database\DatabaseContext.Partial.cs"
8. Add project reference "Shared.Database" to project "Database"
8. Review the entity names, if you see any casing issues, add the prefix or name to the "Token Capitalization Overrides" e.g. EMCR will fix EMcR_ExpenseProject and STOB will fix EMcR_SToB
9. Add nuget packages "Microsoft.PowerPlatform.Dataverse.Client" and "Microsoft.PowerPlatform.Dataverse.Client.Dynamics" to project in step #1
10. Create DTO primitive copies of the entities, enums, etc in a new class library project e.g. "Manager.Contract"
11. Add mappings for the Entity -> DTO and DTO -> Entity 
12. Edit the prefix in file "SharedMapper.cs"
13. Add user secrets found in "ServiceCollectionExtensions.cs" from a developer or OpenShift


### How to generate entities
Open DLaB.EarlyBoundGeneratorV2.DefaultSettings.xml and then click "Generate" button.
This will generate the entities, messages, optionsets in their corresponding folders and DatabaseContext.

NOTE in theory, you could add your authentication profile to PAC using your connection string and then use the command lines found in the generated code. If you do try this, please update this ReadMe.md with your findings.


### Limitations
- Method-based query syntax is limited to joining one table AFAIK
- LINQ query expressions do not fully support `where`
    where => The left side of the clause must be an attribute name and the right side of the clause must be a value. You cannot set the left side to a constant. Both the sides of the clause cannot be constants.
	https://learn.microsoft.com/en-us/power-apps/developer/data-platform/org-service/linq-query-examples


## Troubleshooting

If you encounter a user authentication error and the authentication hasn't changed and your VPN is connected, try restarting the XrmToolbox application. I find this happens often but restarting always fixes the issue.


## Dataverse Cheatsheet

.AddLink - Adds a link between two entity instances that already exist in database
.AddRelatedObject - Adds a new related entity to an existing entity

Try to use the [BaseRepository](https://github.com/bcgov/emcr-dfa-portal/blob/support-develop/shared/src/EMBC.Database.Shared.Database/BaseRepository.cs) as much as possible. Add a repository `<Entity>Repository` that inherits BaseRepository and use the base methods e.g. `repository.FirstOrDefault(predicates)`.
To insert an entity with no attached children entities, use `repository.Insert(dto)`. For an example, see [VSD Insert](https://github.com/bcgov/pssg-cscp-vsd/blob/development/Tests/Integration/Database/ContractRepositoryTests.cs)
To insert an entity with one or more attached children, write an override `<Entity>Repository.Insert` method. For an example, see [VSD Insert with Children](https://github.com/bcgov/pssg-cscp-vsd/blob/development/Resources/Invoice/InvoiceRepository.cs)
To find an the first entity or return NULL if the entity was not found, use `repository.FirstOrDefault(predicates)`.
For other generic reusable LINQ queries like `Single`, add a method to BaseRepository
To query an entity with no joins, use `repository.Where(predicates)`. For an example, see [EMCR DFA Where Test](https://github.com/bcgov/emcr-dfa-portal/blob/support-develop/shared/src/EMBC.Database.Test/RecoveryClaimRepositoryTests.cs)
To query an entity with a single join, use `repository.Query(queryCommand)` by inheriting IQueryRepository. See [EMCR DFA Query](https://github.com/bcgov/emcr-dfa-portal/blob/support-develop/shared/src/EMBC.Database.Resources/RecoveryClaimRepository.cs)
To query an entity with multiple joins, see [EMCR DFA GetPending](https://github.com/bcgov/emcr-dfa-portal/blob/support-develop/shared/src/EMBC.Database.Resources/RecoveryClaimRepository.cs)


## Unit Testing

There is a relatively straight-forward way to unit test. It cannot be used with test runners until it is refactored to work without editing generating code.
To unit test DFA_Event, add the keyword "virtual" to DatabaseContext.DFA_Event property. Now you can run the unit tests in "EventRepositoryTests.cs" without the VPN connected
(except for the first test, read the comments). You can apply this same method to other entities as needed.
NOTE because this dirty method requires editing the generated code, you will lose your changes when you regenerate the entities.


### References
[Dataverse LINQ Queries](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/org-service/build-queries-with-linq-net-language-integrated-query)


# GUIDELINES

## DOs
- Get an entire object with all the properties
- Match the Entity properties directly to DTO e.g. DateTime? -> DateTime not DateTime? -> String.Format
- Generalize functionality e.g. Use Update(entity) not UpdateName(name), use the Generic Repository pattern as much as possible
- Use Repository.Where instead of Repository.Find, when possible

## DONOTs
- Get an object field, instead, get the entire object and use the field(s) needed
- Add mappings to Enum strings on the API side, do this in UI for reusability