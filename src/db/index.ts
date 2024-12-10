import { pool } from './connection.js';
import { QueryResult } from 'pg';

export default class DB {
    constructor(){}

    async query(sql: string, args: any[] = []): Promise<QueryResult> {
        const client = await pool.connect();
        try {
            return client.query(sql, args)
        } finally {
            client.release();
        }
    }
    getDepartments() {
        return this.query(
            "SELECT * FROM departments"
        )
    }
    createDepartments(departments_name: string) {
        return this.query(
            "INSERT INTO departments(name) VALUES ($1)",
            [departments_name]
        )
    }
    deleteDepartments(departments_id: number) {
        return this.query(
            "DELETE FROM departments WHERE id = $1;",
            [departments_id]
        );
    }
    getRoles() {
        return this.query(
            "SELECT departments_name AS departments_name, role.id AS role_id, role.title, role.salary \
            FROM role \
            JOIN departments ON role.departments_id = departments.id"
        );
    }
    getRoleByDepartments(departments_id: number) {
        return this.query(
            "SELECT departments_name AS departments_name, role.id AS role_id, role.title, role.salary \
            FROM role \
            JOIN departments ON role.departments_id = departments.id\
            WHERE departments.id = $1;"
            [departments_id]
        );
    }
    createRole(title: string, salary: number, departments_id: number) {
        return this.query(
            "DELETE FROM role WHERE id = $1;",
            [title, salary, departments_id]
        );
    }
    updateRoleTitle(role_id: number, salary: string) {
        return this.query(
            "UPDATE role SET salary = $1 WHERE id = $2",
            [salary, role_id]
        )
    }
    getEmployees() {
        return this.query(
            "SELECT \
                employee.id, \
                employee.first_name, \
                employee.last_name, \
                manager.first_name AS manager_first_name, \
                manager.last_name AS manager_last_name, \
                role.title, \
                role.salary, \
                departments_name AS departments_name \
            FROM \
                employee \
            JOIN \
                role ON employee.role_id = role.id \
            JOIN \
                departments ON role.departments_id = departments.id \
            LEFT JOIN \
                employee AS manager ON employee.manager_id = manager.id \
            ORDER BY \
                employee.id;"
        )
    }
    employeesByRole(role_id: number) {
        return this.query(
        "SELECT \
                employee.id, \
                employee.first_name, \
                employee.last_name, \
                manager.first_name AS manager_first_name, \
                manager.last_name AS manager_last_name, \
                role.title, \
                role.salary, \
                departments_name AS departments_name \
            FROM \
                employee \
            JOIN \
                role ON employee.role_id = role.id \
            JOIN \
                departments ON role.departments_id = departments.id \
            LEFT JOIN \
                employee AS manager ON employee.manager_id = manager.id \
            WHERE \
                role.id = $1\
            ORDER BY \
                role.id;",
            [role_id]
        );
    }
    employeesByDepartments(departments_id: number) {
        return this.query(
            "SELECT \
                employee.id, \
                employee.first_name, \
                employee.last_name, \
                manager.first_name AS manager_first_name, \
                manager.last_name AS manager_last_name, \
                role.title, \
                role.salary, \
                departments_name AS departments_name \
            FROM \
                employee \
            JOIN \
                role ON employee.role_id = role.id \
            JOIN \
                departments ON role.departments_id = departments.id \
            LEFT JOIN \
                employee AS manager ON employee.manager_id = manager.id \
            WHERE \
                departments.id = $1 \
            ORDER BY \
                departments.id, role.id\;",
            [departments_id]
        )
    }
    employeeByManager(manager_id: number) {
        return this.query(
            "SELECT \
                employee.id, \
                employee.first_name, \
                employee.last_name, \
                manager.first_name AS manager_first_name, \
                manager.last_name AS manager_last_name, \
                role.title, \
                role.salary, \
                departments_name AS departments_name \
            FROM \
                employee \
            JOIN \
                role ON employee.role_id = role.id \
            JOIN \
                departments ON role.departments_id = departments.id \
            LEFT JOIN \
                employee AS manager ON employee.manager_id = manager.id \
            WHERE \
                manager.id = $1 \
            ORDER BY \
                manager.id, role.id\;",
            [manager_id]
        );
    }
    getManager() {
        return this.query(
            "SELECT manager.id AS manager_id, manager.first_name AS manager_first_name, manager.last_name as manager_last_name \
            FROM employee \
            JOIN employee as manager ON employee.manager_id = manager.id \
            GROUP BY manager.id, manager.first_name, manager.last_name;"
        );
    }
    newEmployee(first_name: string, last_name: string, role_id: number, manager_id: (number | null)) {
        return this.query(
            "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);",
            [first_name, last_name, role_id, manager_id]
        );
    }
    deleteEmployee(employee_id: number) {
        return this.query(
            "DELETE FROM employee WHERE id = $1;",
            [employee_id]
        );
    }
    updateEmployeeName(first_name: string, last_name: string, employee_id: number) {
        return this.query(
            "UPDATE employee SET first_name = $1, last_name = $2 WHERE id = $3",
            [first_name, last_name, employee_id]
        );
    }
    changeManager(employee_id: number, manager_id: number) {
        return this.query(
            "UPDATE employee SET manager_id = $1 WHERE id = $2",
            [manager_id, employee_id]
        );
    }
    changeEmployeeRole(employee_id: number, role_id: number) {
        return this.query(
            "UPDATE employee SET role_id = $1 WHERE id = $2",
            [role_id, employee_id]
        );
    }
    deleteRole(role_id: number) {
        return this.query(
            "DELETE FROM role WHERE id = $1"
            [role_id]
        )
    }
}