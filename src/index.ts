import DB from "./db/index.js";
import inquirer from "inquirer"

const db = new DB();

function mainMenu() {
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'choice',
                message: "Choose an option",
                choices: [
                    {
                        name: "View all departments",
                        value: "VIEW_DEPARTMENTS"
                    },
                    {
                        name: "Add Department",
                        value: "ADD_DEPARTMENT",
                    },
                    {
                        name: "View All Employees",
                        value: "VIEW_EMPLOYEES"
                    },
                    {
                        name: "Add new Employee",
                        value: "ADD_EMPLOYEE"
                    },
                    {
                        name: "View Employee by Manager",
                        value: "VIEW_EMPLOYEE_BY_MANAGER"
                    },
                    {
                        name: 'View Employees by Department',
                        value:'VIEW_EMPLOYEE_BY_DEPARTMENT'
                    },
                    {
                        name: 'View All Roles',
                        value:'VIEW_ROLES',
                    },
                    {
                        name: 'Add New Role',
                        value:'ADD_ROLE',
                    },
                    {
                        name: 'Update Employee Role',
                        value:'UPDATE_EMPLOYEE_ROLE',
                    },
                    {
                        name: 'Update Employee Manager',
                        value: 'UPDATE_EMPLOYEE_MANAGER'
                    },
                    {
                        name: 'Delete Employee',
                        value:'DELETE_EMPLOYEE',
                    },
                    {
                        name: 'Delete Role',
                        value:'DELETE_ROLE',
                    },                
                    {
                        name: 'Delete Department',
                        value:'DELETE_DEPARTMENT',
                    },
                    {
                        name: 'View salary totals by department',
                        value: 'VIEW_SALARY_BY_DEPARTMENT'
                    },
                    {
                        name: "Exit",
                        value: "EXIT"
                    },
                ]
            }
        ]
    )
    .then(res => {
        const choice = res.choice;

        switch (choice) {
            case 'VIEW_DEPARTMENTS':
                viewAllDepartments();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'VIEW_EMPLOYEES':
                viewAllEmployees();
                break;
            case 'ADD_EMPLOYEE':
                addEmployees();
                break;
            case 'VIEW_EMPLOYEE_BY_MANAGER':
                viewEmpByManager();
                break;
            case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                viewEmpByDepartment();
                break;
            case 'VIEW_ROLES':
                viewRoles();
                break;
            case 'ADD_ROLE':
                addRole()
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
                break;
            case 'DELETE_EMPLOYEE':
                deleteEmployee();
                break;
            case 'DELETE ROLE':
                deleteRole();
                break;
            case 'DELETE_DEPARTMENT':
                deleteDepartment();
                break;
            default:
                quit();
        }
    });
}

function viewAllDepartments() {
    db.getDepartments()
        .then(( { rows } ) => {
            const departments = rows;
            console.log('\n');
            console.table(departments);
        })
        .then(() => mainMenu());
}

function addDepartment() {
    inquirer.prompt([
        {
            name: 'departmentName',
            message: 'Department Name: ',
            type: 'input'
        }
    ])
    .then(res => {
        db.createDepartments(res.departmentName)
            .then(() => {
                console.log('\n');
                console.log("New Department Added");
                mainMenu();
            })
    })
}
async function deleteDepartment() {
    const queryResponse = await db.getDepartments();
    const choicesArray = queryResponse.rows.map(employee => {
        return {
            name: employee.first_name.concat('', employee.last_name),
            value: employee.id
        }
    });
    inquirer.prompt([
        {
            name: 'departmentId',
            message: 'What department do you want to delete',
            type: 'list',
            choices: choicesArray
        }
    ])
}
async function addEmployees() {
    const roleQueryResponse = await db.getRoles();

    const roleArr = roleQueryResponse.rows.map(role => {
        return {
            name: role.title,
            value: role.id
        }
    });
    const queryResponse = await db.getEmployees();

    const choiceArr = queryResponse.rows.map(employee => {
        return {
            name: employee.first_name.concat('', employee.last_name),
            value: employee.id
        }
    });
    choiceArr.unshift({name: "None", value: null});

    inquirer.prompt([
        {
            name: 'employeeFirstName',
            message: 'First Name: ',
            type: 'input'
        },
        {
            name: 'employeeLastName',
            message: 'Last Name: ',
            type: 'input'
        },
        {
            name: 'employeeRole',
            message: "What is the employee's role?",
            type: 'list',
            choices: roleArr
        },
        {
            name: 'employeeManager',
            message: "Who is the employee's manager?",
            type: 'list',
            choices: choiceArr
        }
    ])
    .then(res => {
        db.newEmployee(res.employeeFirstName, res.employeeLastName, res.employeeManager, res.employeeRole)
        .then(() => {
            console.log('\n')
            console.log('New Employee Added')
            mainMenu();
        })
    })
}
async function viewEmpByDepartment() {
    const queryResponse = await db.getDepartments();
    const depArray = queryResponse.rows.map((department) => {
        return {
            name: department.department_name,
            value: department.id
        }
    });
    inquirer.prompt([
        {
            name: 'employeeDepartment',
            message: 'Which department employees do you want to see',
            type: 'list',
            choices: depArray
        }
    ])
    .then( async res => {
        const queryResponse = await db.employeesByDepartments(res.employeeDepartment);
        if (queryResponse.rowCount !=0) {
            console.log("\n");
            console.log("This department has these employees:");
            console.table(queryResponse.rows);
        } else {
            console.log("\n");
            console.log("This department does not have any employees.");
        }
        mainMenu();
    });
}
function viewAllEmployees() {
    db.getEmployees()
        .then(( { rows } ) => {
            const employees = rows;
            console.log('\n');
            console.table(employees)
        })
        .then(() => mainMenu());
}

async function viewEmpByManager() {
    const queryResponse = await db.getManager();

    const empArray = queryResponse.rows.map((employee) => {
        return {
            name: employee.first_name + ' ' + employee.last_name,
            value: employee.id
        }
    });
    inquirer.prompt([
        {
            name: 'employeeManager',
            message: 'Which managers employees?',
            type: 'list',
            choices: empArray
        }
    ])
    .then(res => 
        db.employeeByManager(res.employeeManager)
            .then(({ rows }) => {
                const employee = rows;
                console.log('\n');
                console.table(employee);
            })
        )
        .then(() => mainMenu());
}
async function deleteEmployee() {
    const queryResponse = await db.getEmployees();

    const choiceArr = queryResponse.rows.map(employee => {
        return {
            name: employee.first_name.concat(' ', employee.last_name),
            value: employee.id
        }
    });
    inquirer.prompt([
        {
            name: 'employeeId',
            message: 'Which employee: ',
            type: 'list',
            choices: choiceArr
        }
    ])
    .then(async res => {
        await db.deleteEmployee(res.employeeId);
        console.log('\n')
        console.log('Employee Deleted')
        mainMenu();
    });
}
function viewRoles() {
    db.getRoles()
    .then(({rows}) => {
        const roles = rows;
        console.log('\n')
        console.log(roles);
    })
}
async function deleteRole() {
    const queryResponse = await db.getRoles();

    const choiceArr = queryResponse.rows.map(role => {
        return {
            name: role.title,
            value: role.id
        }
    });
    inquirer.prompt([
        {
            name: 'roleId',
            message: 'Choose Role: ',
            type: 'list',
            choices: choiceArr
        }
    ])
    .then(async res => {
        await db.deleteRole(res.roleId);
        console.log("\n");
        console.log(`This role has been deleted.`);
        console.log("\n");
        mainMenu();
    })
}
async function addRole() {
    const depQueryResponse = await db.getDepartments();
    const depArray = depQueryResponse.rows.map(department => {
        return {
            name: department.department_name,
            value: department.id
        }
    });
    inquirer.prompt ([
        {
            name: 'roleTitle',
            message: "Role Title: ",
            type: 'input',
        },
        {
            name: 'roleSalary',
            message: "Salary: ",
            type: 'input',
        },
        {
            name: 'roleDepartment',
            message: "Which Department:",
            type: 'list',
            choices: depArray
        }
    ])
    .then(res => {
        db.createRole(res.roleTitle, res.roleDepartment, res.roleSalary)
        .then(() => {
            console.log('\n')
            console.log("Role Added")
            mainMenu();
        })
    })
} 
async function updateEmployeeRole() {
    const empQueryResponse = await db.getEmployees();
    const empArray = empQueryResponse.rows.map(employee => {
        return {
            name: employee.first_name.concat(' ', employee.last_name),
            value: employee.id
        }
    });

    const roleQueryResponse = await db.getRoles();
    const roleArr = roleQueryResponse.rows.map(role => {
        return {
            name: role.title,
            value: role.id
        }
    })
    inquirer.prompt([
        {
            name: 'employeeSelect',
            message: "Which employee's role would you like to update?",
            type: 'list',
            choices: empArray
        },
        {
            name: 'roleSelect',
            message: "What role would you like to give this employee?",
            type: 'list',
            choices: roleArr
        }
    ])
}
function quit() {
    console.log("Exiting System")
    process.exit();
}
mainMenu();