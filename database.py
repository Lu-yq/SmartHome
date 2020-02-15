import sqlite3

conn = sqlite3.connect('test.db')
print("Opened database successfully")
c = conn.cursor()
c.execute('''DROP TABLE SENSOR; ''')
print("Table deleted successfully")
c.execute('''CREATE TABLE SENSOR
       (ID        INT,
       SEN_ID  TEXT   PRIMARY KEY     NOT NULL,
       INDICATION    TEXT    NOT NULL,
       ROOM_ID        TEXT     NOT NULL);
       ''')
print("Table created successfully")
conn.commit()

c.execute("INSERT INTO SENSOR (ID,SEN_ID,INDICATION,ROOM_ID) \
      VALUES (1, 'sensor01', 'temperature', 'room01')")

c.execute("INSERT INTO SENSOR (ID,SEN_ID,INDICATION,ROOM_ID) \
      VALUES (2, 'sensor02', 'humidity', 'room02' )")

c.execute("INSERT INTO SENSOR (ID,SEN_ID,INDICATION,ROOM_ID) \
      VALUES (3, 'sensor03', 'illumination', 'room03' )")

c.execute("INSERT INTO SENSOR (ID,SEN_ID,INDICATION,ROOM_ID) \
      VALUES (4, 'sensor04', 'sound', 'room04' )")

conn.commit()
print("Records created successfully")
conn.close()

conn = sqlite3.connect('test.db')
print("Opened database successfully")
c = conn.cursor()
# c.execute('''CREATE TABLE DEVICE
#        (ID        INT,
#        DEV_ID  TEXT   PRIMARY KEY     NOT NULL,
#        NAME    TEXT    NOT NULL,
#        ROOM_ID        TEXT     NOT NULL);
#        ''')
# print("Table DEVICE created successfully")
# conn.commit()

c.execute("INSERT INTO DEVICE (ID,DEV_ID,NAME,ROOM_ID) \
      VALUES (1, 'device01', 'LED', 'room01')")

c.execute("INSERT INTO DEVICE (ID,DEV_ID,NAME,ROOM_ID) \
      VALUES (2, 'device02', 'buzzer', 'room02' )")

c.execute("INSERT INTO DEVICE (ID,DEV_ID,NAME,ROOM_ID) \
      VALUES (3, 'device03', 'LCD', 'room03' )")

c.execute("INSERT INTO DEVICE (ID,DEV_ID,NAME,ROOM_ID) \
      VALUES (4, 'device04', 'e-relay', 'room04' )")

conn.commit()
print("Records created successfully")
conn.close()

conn = sqlite3.connect('test.db')
print("Opened database successfully")
c = conn.cursor()
c.execute('''CREATE TABLE SENSOR_DATA
       (ID  INT    PRIMARY KEY ,
       SEN_ID  TEXT   NOT NULL,
       INDICATION    TEXT    NOT NULL,
       ROOM_ID        TEXT     NOT NULL,
       VALUE      TEXT   NOT NULL,
        TIME   TimeStamp    NOT NULL  DEFAULT CURRENT_TIMESTAMP  );
       ''')
print("Table SENSOR_DATA created successfully")
conn.commit()

c.execute("INSERT INTO SENSOR_DATA (ID,SEN_ID,INDICATION,ROOM_ID,VALUE) \
      VALUES (1, 'sensor01', 'temperature', 'room01', '26℃' )")

c.execute("INSERT INTO SENSOR_DATA (ID,SEN_ID,INDICATION,ROOM_ID,VALUE) \
      VALUES (2, 'sensor02', 'humidity', 'room02', '49%' )")

c.execute("INSERT INTO SENSOR_DATA (ID,SEN_ID,INDICATION,ROOM_ID,VALUE) \
      VALUES (3, 'sensor03', 'illumination', 'room03', '100lx' )")

c.execute("INSERT INTO SENSOR_DATA (ID,SEN_ID,INDICATION,ROOM_ID,VALUE) \
      VALUES (4, 'sensor04', 'sound', 'room04', 'on' )")

conn.commit()
print("Records created successfully")
conn.close()

conn = sqlite3.connect('test.db')
print("Opened database successfully")
c = conn.cursor()
c.execute('''CREATE TABLE ROOM
       (ID        INT,
       ROOM_ID   TEXT  PRIMARY KEY     NOT NULL,
       NAME    TEXT    NOT NULL);
       ''')
print("Table ROOM created successfully")
conn.commit()

c.execute("INSERT INTO ROOM (ID,ROOM_ID,NAME) \
      VALUES (1, 'room01', '主卧' )")

c.execute("INSERT INTO ROOM (ID,ROOM_ID,NAME) \
      VALUES (2, 'room02', '客房' )")

c.execute("INSERT INTO ROOM (ID,ROOM_ID,NAME) \
      VALUES (3, 'room03', '客厅' )")

c.execute("INSERT INTO ROOM (ID,ROOM_ID,NAME) \
      VALUES (4, 'room04', '卫生间' )")

conn.commit()
print("Records created successfully")
conn.close()

conn = sqlite3.connect('test.db')
print("Opened database successfully")
c = conn.cursor()
c.execute('''CREATE TABLE RULE
       (ID   INT,
       RULE_ID  TEXT   PRIMARY KEY   NOT NULL,
       NAME    TEXT    NOT NULL,
       SEN_ID  TEXT   NOT NULL,
       VALUE      TEXT   NOT NULL,
       DEV_ID  TEXT  NOT NULL,
       OPERATION   TEXT  NOT NULL
        );
       ''')
print("Table RULE created successfully")
conn.commit()

c.execute("INSERT INTO RULE (ID,RULE_ID,NAME,SEN_ID,VALUE, DEV_ID, OPERATION) \
      VALUES (1, 'rule01', 'upAirCondition', 'sensor01', '10℃', 'device04','Turn up the air conditioning temperature.' )")

c.execute("INSERT INTO RULE (ID,RULE_ID,NAME,SEN_ID,VALUE, DEV_ID, OPERATION) \
      VALUES (2, 'rule02', 'downAirCondition', 'sensor01', '30℃', 'device04','Turn down the air conditioning temperature.' )")

c.execute("INSERT INTO RULE (ID,RULE_ID,NAME,SEN_ID,VALUE, DEV_ID, OPERATION) \
      VALUES (3, 'rule03', 'openLED', 'sensor03', '10lx', 'device01', 'Turn on the LED' )")

c.execute("INSERT INTO RULE (ID,RULE_ID,NAME,SEN_ID,VALUE, DEV_ID, OPERATION) \
      VALUES (4, 'rule04', 'offLED', 'sensor03', '1000lx', 'device01', 'Turn off the LED' )")

conn.commit()
print("Records created successfully")
conn.close()


conn = sqlite3.connect('test.db')
print("Opened database successfully")
c = conn.cursor()
c.execute('''CREATE TABLE RULE_TRIGEGED
       (ID  INT   PRIMARY KEY,
       RULE_ID    TEXT   NOT NULL,
       RULE_NAME    TEXT    NOT NULL,
       DEV_ID  TEXT  NOT NULL,
       TIME   TimeStamp    NOT NULL  DEFAULT CURRENT_TIMESTAMP  
        );
       ''')
print("Table RULE_TRIGEGED created successfully")
conn.commit()

c.execute("INSERT INTO RULE_TRIGEGED (ID,RULE_ID,RULE_NAME,DEV_ID ) \
      VALUES (1, 'rule01', 'upAirCondition', 'device04' )")

c.execute("INSERT INTO RULE_TRIGEGED (ID,RULE_ID,RULE_NAME,DEV_ID ) \
      VALUES (2, 'rule02', 'downAirCondition', 'device04' )")

c.execute("INSERT INTO RULE_TRIGEGED (ID,RULE_ID,RULE_NAME,DEV_ID ) \
      VALUES (3, 'rule03', 'openLED', 'device01' )")

c.execute("INSERT INTO RULE_TRIGEGED (ID,RULE_ID,RULE_NAME,DEV_ID ) \
      VALUES (4, 'rule04', 'offLED', 'device01' )")

conn.commit()
print("Records created successfully")
conn.close()
