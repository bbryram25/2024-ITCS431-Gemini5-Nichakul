# Gemini5\_D3\_Analysis.md
## Usecase Description

| Attribute                     | Description                                                                                       |
|-------------------------------|---------------------------------------------------------------------------------------------------|
| **Use Case Name**                  | Validate a science plan                                                                           |
| **ID**                            | 1                                                                                                 |
| **Importance Level**              | High                                                                                              |
| **Primary actor**                 | Science Observer                                                                                  |
| **Use Case Type**                 | Essential, Detail                                                                                 |
| **Stakeholders and Interests**    | 1. Science Observer: Ensures the plan is complete, feasible, and meets operational constraints.<br>2. Astronomer: Provides modifications if issues are found.       |
| **Brief Description**             | The Science Observer retrieves a submitted science plan from the system, validates it for completeness, feasibility, and compliance, using a virtual telescope, and either validates or requests modifications. Once validated, the plan is converted into an observing program and submitted to the observing program. |
| **Trigger**                       | The submission of a new or modified Science Plan.                                                 |
| **Type**                          | External                                                                                          |
| **Relationships**                 | Association:<br>- The Science Observer is associated with the Validate a Science Plan use case since they perform the validation.<br>- The Astronomer is associated with this use case as they provide modifications when requested.<br>- The Astronomer is associated with this use case as they provide modifications when requested.<br>- The System is involved as it stores and manages the science plan.<br>- The Observing program receives the validated observing program.<br>Include: -<br>Extend: -<br>Generalization: -     |
| **Normal flow**                   | 1. The science observer logs into the system.<br>2. The system verifies username and password.<br>3. The science observer requests for the science plan.<br>4. The science observer retrieves the submitted science plan.<br>5. The science observer validates the plan for completeness, feasibility, and compliance using a virtual telescope.<br>6. If there are issues found, the science observer requests modifications from the astronomer to resubmit the plan.<br>7. Once all criteria are met, the science observer validates the plan and clicks the ‘Approved’ button.<br>8. The science observer converts the validated plan into a structured observing program.<br>9. The science observer submits an observing program.                                                           |
| **Subflows**                      | None                                                                                              |
| **Alternate/Exceptional Flow**    | Exceptional for Event 2:<br>- If the username and password of the customer is incorrect, the system will prompt the customer to fill in the username and password again.<br>Exceptional for Event 5:<br>- If the science plan is incomplete or infeasible:<br>1. The science observer gets modifications from the astronomer.<br>2. The astronomer resubmits the science plan.<br>3. The science observer repeats validation until all criteria are met.                                                                          |

| Attribute                     | Description                                                                                       |
|-------------------------------|---------------------------------------------------------------------------------------------------|
| **Use Case Name**             | Create a Science Plan                                                                               |
| **ID**                        | 2                                                                                                 |
| **Importance Level**          | High                                                                                              |
| **Primary actor**             | Astronomer                                                                                        |
| **Use Case Type**             | Essential, Detail                                                                                 |
| **Stakeholders and Interests**| 1. Astronomer: Responsible for creating a valid science plan for observation.                       |
| **Brief Description**         | This use case describes the process where an Astronomer logs into the system, creates a science plan, and the system verifies its completeness. If the plan is valid, it is successfully created; otherwise, the system logs an error indicating failure. |
| **Trigger**                   | The Astronomer initiates the creation of a Science Plan.                                           |
| **Type**                      | External                                                                                          |
| **Relationships**             | Association:<br>- Astronomer<br>Include: -<br>Extend: -<br>Generalization: - |
| **Normal flow**               | 1. The Astronomer logs into the system.<br>2. The system verifies the credentials.<br>3. The Astronomer starts creating a Science Plan while observing.<br>4. The system checks the completeness of the Science Plan.<br>5. If the plan is complete, the system logs "Science Plan Created". |
| **Subflows**                  | If the plan parameters are valid:<br>- The system confirms the completeness of the plan.<br>- The plan is successfully created and logged.<br>If the plan parameters are invalid:<br>- The system logs an error stating "Create Science Plan Failed".<br>- The Astronomer must modify the plan and try again. |
| **Alternate/Exceptional Flow**| Exceptional for Event 2:<br>- If the astronomer enters incorrect credentials:<br>  The system displays an error message.<br>- The astronomer can retry login or reset the password.<br>Exceptional for Event 4: Issue with Science Plan Parameters<br>- If the science plan parameters are invalid:<br>  The system discards the Science Plan.<br>- The Astronomer must modify the plan and resubmit it. |


| Attribute                     | Description                                                                                       |
|-------------------------------|---------------------------------------------------------------------------------------------------|
| **Use Case Name**             | Submit Science Plan                                                                                |
| **ID**                        | 3                                                                                                 |
| **Importance Level**          | High                                                                                              |
| **Primary actor**             | Astronomer                                                                                         |
| **Use Case Type**             | Essential, Detail                                                                                 |
| **Stakeholders and Interests**| 1. Astronomer: Ensures the science plan is properly tested and submitted for execution.<br>2. Science Observer: Executes the submitted science plan for astronomical data collection.<br>3. System: Needs to verify the status of the science plan before submission. |
| **Brief Description**         | This use case describes the process of an astronomer logging into the system, retrieving unsubmitted science plans, verifying their testing status, and submitting them for execution if tested. |
| **Trigger**                   | The astronomer initiates the submission of a science plan.                                        |
| **Type**                      | External                                                                                          |
| **Relationships**             | Association:<br>- Astronomer.<br>Include: -<br>Extend: -<br>Generalization: -                      |
| **Normal flow**               | 1. The astronomer logs into the system.<br>2. The system verifies the credentials.<br>3. The astronomer browses the list of all science plans that are not submitted.<br>4. The astronomer selects a science plan and checks its status.<br>5. If the science plan is tested, the system logs the status as "Tested".<br>6. The system allows the astronomer to submit the science plan.<br>7. The astronomer proceeds with the submission of the science plan. |
| **Subflows**                  | If the science plan is not tested:<br>- The system logs the status as "Not Tested".<br>- The astronomer initiates testing for the science plan.<br>- After testing, the system updates the status and logs the result. |
| **Alternate/Exceptional Flow**| Exceptional for Event 2:<br>- If the astronomer's login credentials are invalid, access is denied.<br>Exceptional for Event 3:<br>- If no unsubmitted science plans are available, the system notifies the astronomer.<br>Exceptional for Event 7:<br>- If the science plan submission fails due to a system error, an error message is displayed. |

| Attribute                     | Description                                                                                       |
|-------------------------------|---------------------------------------------------------------------------------------------------|
| **Use Case Name**             | Monitor the Progress of a Science Plan Execution                                                   |
| **ID**                        | 4                                                                                                 |
| **Importance Level**          | High                                                                                              |
| **Primary actor**             | Science Observer                                                                                 |
| **Use Case Type**             | Essential, Detail                                                                                 |
| **Stakeholders and Interests**| 1. Astronomer: Wants to ensure the observation is conducted according to the planned parameters. May remotely monitor progress.<br>2. Science Observer: Ensures that the execution follows the science plan and makes real-time adjustments if necessary. |
| **Brief Description**         | This use case describes the process of a Science Observer monitoring the execution of an observing program. The system continuously updates the observer on progress and status. If an abnormality is detected, the system alerts the Telescope Operator, who can adjust instrument parameters. Once the observation is completed, an Observation Report is generated. |
| **Trigger**                   | The Science Observer begins monitoring an executing observing program.                           |
| **Type**                      | External                                                                                          |
| **Relationships**             | Association:<br>- Science Observer<br>- Telescope Operator<br>Include: -<br>Extend: -<br>Generalization: - |
| **Normal flow**               | 1. The Science Observer selects an executing observing program from the system.<br>2. The System displays the progress and current status of the observation, including:<br>- Telescope position and movement<br>- Instrument configuration and settings<br>- Weather conditions<br>- Data acquisition status<br>3. The Science Observer monitors the execution in real-time.<br>4. If adjustments are required, the Telescope Operator modifies parameters/instrument settings.<br>5. The System checks for abnormalities.<br>6. If abnormalities are detected, the System triggers an alert to the Science Observer and Telescope Operator.<br>7. If no abnormalities are found, the observation continues.<br>8. The System checks if the observation is completed.<br>- If NO, the process returns to Step 5 (Monitoring Phase).<br>- If YES, the System generates an Observation Report and logs results.<br>9. The Observation Report is reviewed by the Science Observer.<br>10. The System archives the collected data for future reference.<br>11. The process ends successfully. |
| **Subflows**                  | If an abnormality is detected:<br>- The System logs the issue and alerts the Telescope Operator, who intervenes and adjusts parameters.<br>If an adjustment is made:<br>- The System updates the execution status and returns to monitoring.<br>If the Science Observer requests more details:<br>- The System provides logs and status history. |
| **Alternate/Exceptional Flow**| Exceptional for Event 2: System Fails to Display Observation Status<br>- If the system encounters an error retrieving observation data:<br>1. The system displays an error message indicating the failure to fetch real-time updates.<br>2. The Science Observer can retry accessing the status or report the issue to system support.<br>Exceptional for Event 5: Abnormality Detected but Not Resolved<br>- If an abnormality is detected but the Telescope Operator is unable to resolve it:<br>1. The System escalates the issue to a higher authority (e.g., Engineering Team or Administrator).<br>2. The Observation may be paused until the issue is addressed.<br>3. The Science Observer is notified of the unresolved issue.<br>Exceptional for Event 6: Observation Halted Due to Critical Failure<br>- If a critical system failure occurs (e.g., telescope malfunction, instrument failure, severe weather):<br>1. The System immediately halts the observation for safety reasons.<br>2. The Science Observer and Telescope Operator receive an emergency alert.<br>3. The System logs the failure and suggests possible recovery actions.<br>  4. The Science Observer decides whether to restart, reschedule, or cancel the observation.<br>Exceptional for Event 7: Observation Report Fails to Generate<br>- If the system encounters an error generating the Observation Report:<br>1. The System logs the issue and notifies the Science Observer.<br>  2. The Science Observer may retry generating the report or manually retrieve observation logs.<br>3. If the issue persists, technical support intervention may be required. |


| Attribute                     | Description                                                                                       |
|-------------------------------|---------------------------------------------------------------------------------------------------|
| **Use Case Name**             | Test a Science Plan                                                                                |
| **ID**                        | 5                                                                                                 |
| **Importance Level**          | High                                                                                              |
| **Primary actor**             | Astronomer                                                                                       |
| **Use Case Type**             | Essential, Detail                                                                                 |
| **Stakeholders and Interests**| 1. Astronomer: Wants to verify that the science plan is correctly structured and functional before submission.<br>2. Telescope Operator: May assist if issues arise with the virtual telescope system. |
| **Brief Description**         | This use case describes the process in which an astronomer tests a science plan using an interactive observing (virtual telescope) system. The system simulates execution and provides feedback on feasibility. |
| **Trigger**                   | The astronomer initiates the test to verify the science plan before submission.                   |
| **Type**                      | External                                                                                          |
| **Relationships**             | Association:<br>- Astronomer<br>Include: Operate the interactive observing (virtual telescope)<br>Extend: -<br>Generalization: - |
| **Normal flow**               | 1. The astronomer logs into the system.<br>2. The system verifies the credentials.<br>3. The astronomer selects a science plan.<br>4. The system loads the plan and prepares it for testing.<br>5. The astronomer initiates the test with the virtual telescope system.<br>6. The system simulates the plan and analyzes feasibility.<br>7. The system provides feedback on the test results.<br>8. If the test fails, the astronomer adjusts the plan and retests.<br>9. If the test passes, the astronomer marks the plan as "Tested." |
| **Subflows**                  | None                                                                                              |
| **Alternate/Exceptional Flow**| Exceptional for Event 2:<br>- If the astronomer's login credentials are invalid, access is denied.<br>Exceptional for Event 3:<br>- If no unsubmitted science plans are available, the system notifies the astronomer.<br>Exceptional for Event 4:<br>- If the system fails to load the science plan, an error message is displayed, and the astronomer is asked to try again later.<br>Exceptional for Event 5:<br>- If the virtual telescope system is unavailable, the system notifies the astronomer and allows them to retry later.<br>Exceptional for Event 6:<br>- If the test cannot be completed due to an execution error, the system logs the error and notifies the administrator for troubleshooting.<br>If the science plan submission fails due to a system error, an error message is displayed, and the astronomer is asked to try again later. |

## Activity Diagram And Sequence Diagram
### Validate a Science Plan
![Gemini 5 Validate a Science Plan](images/P1/Gemini5%20-%20Validate%20a%20science%20plan.jpg)

### Create Science Plan
![Gemini 5 Create a Science Plan](images/P1/Gemini5%20-%20Create%20science%20plan.jpg)

### Submit Science Plan
![Gemini 5 Submit a Science Plan](images/P1/Gemini5%20-%20Submit%20Science%20Plan.jpg)

### Monitor the Progress of a Science Plan Execution
![Gemini 5 Monitor the progress of a science plan execution](images//P1Gemini5%20-%20Monitor%20the%20progress%20of%20a%20science%20plan%20execution.jpg)

### Test a Science Plan
![Gemini 5 Test a Science Plan](images/P1/Gemini5%20-%20Test%20a%20Science%20Plan.jpg)

## Class Diagram
![Gemini 5 Class Diagram](images/P1/Gemini5%20-%20class%20did.jpg)

## Group Members

| ID | Name |
| :---- | :---- |
| 6588051 | Benjaphol Kositanon |
| 6588075 | Sorawit Piriyapanyaporn |
| 6588152 | Jinnipa Leepong |
| 6588164 | Thonthan Arunyawas |
| 6588178 | Nichakul Kongnual |
| 6588187 | Punyaporn Putthajaksri |