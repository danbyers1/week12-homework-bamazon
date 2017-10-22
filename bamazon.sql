CREATE DATABASE IF NOT EXISTS bamazon;
USE bamazon;

DROP TABLE IF EXISTS toysForSale;

CREATE TABLE toysForSale (
	item_id INT(10),
    product_name VARCHAR(100),
	department_name VARCHAR(50),
    price DECIMAL (7,2),
    stock_quantity INT(7),
    PRIMARY KEY (item_id)
);

LOCK TABLES toysForSale WRITE;

ALTER TABLE toysForSale DISABLE KEYS;

INSERT INTO toysForSale VALUES
(1,'Galvatron','toy',20.00,10),
(2,'Megatron','toy',14.99,5),
(3,'Optimus Prime','toy',55.99,8),
(4,'Bumble Bee','toy',19.99,20),
(5,'Soundwave','toy',19.99,20),
(6,'Luke Skywalker','toy',89.50,6),
(7,'Princess Leia','toy',97.99,4),
(8,'Han Solo','toy',82.99,14),
(9,'Storm Trooper','toy',9.99,10),
(10,'Darth Vader','toy',47.99,30);

ALTER TABLE toysForSale ENABLE KEYS;

UNLOCK TABLES;