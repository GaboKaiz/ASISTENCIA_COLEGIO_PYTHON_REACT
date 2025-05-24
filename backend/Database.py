import mysql.connector
from mysql.connector import Error


def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='colegio_asistencia',
            user='root',  # Cambia esto según tu configuración
            password=''  # Cambia esto según tu configuración
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error conectando a MySQL: {e}")
        return None


def add_teacher(nombre, dni, correo, celular, foto_path):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = """
                INSERT INTO docentes (nombre, dni, correo, celular, foto)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nombre, dni, correo, celular, foto_path))
            connection.commit()
            return True
        except Error as e:
            print(f"Error: {e}")
            return False
        finally:
            cursor.close()
            connection.close()
    return False


def verify_teacher(dni):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            query = "SELECT * FROM docentes WHERE dni = %s"
            cursor.execute(query, (dni,))
            teacher = cursor.fetchone()
            return teacher
        except Error as e:
            print(f"Error: {e}")
            return None
        finally:
            cursor.close()
            connection.close()
    return None


def mark_attendance(docente_id, tipo):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = """
                INSERT INTO asistencia (docente_id, tipo, fecha_hora)
                VALUES (%s, %s, NOW())
            """
            cursor.execute(query, (docente_id, tipo))
            connection.commit()
            return True
        except Error as e:
            print(f"Error: {e}")
            return False
        finally:
            cursor.close()
            connection.close()
    return False


def get_attendance_by_teacher(nombre):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            query = """
                SELECT d.nombre, d.dni, a.tipo, a.fecha_hora
                FROM asistencia a
                JOIN docentes d ON a.docente_id = d.id
                WHERE d.nombre LIKE %s
                ORDER BY a.fecha_hora DESC
            """
            cursor.execute(query, (f"%{nombre}%",))
            attendance = cursor.fetchall()
            return attendance
        except Error as e:
            print(f"Error: {e}")
            return []
        finally:
            cursor.close()
            connection.close()
    return []
