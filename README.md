Database yang digunakan adalah Local Database MySQL MariaDB

Nama DB: ujikom_books_rental
Nama Tabel: 
- users
- books
- rentals
- payments

Isi Tabel
-) users:
    - id PK
    - name
    - email
    - password
    - role
-) books:
    - id PK
    - status
    - title
    - author
    - publisher
    - isbn
    - total_pages
    - publish_year
    - digitized_year
    - cover_path
-) rentals:
    - id PK
    - status
    - user_id FK id ref table users
    - book_id FK id ref table books
    - rent_date
    - due_date
-) payments:
    - id PK
    - order_id
    - user_id
    - book_id
    - ammount
    - status
    - created_at
    - duration
