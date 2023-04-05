# Sample Stream

**Category:** This is a sample app that includes usage of the Python SDK. In this case, the SDK is used to manage a stream of messages between the user’s keyboard and the GDN.

## Summary

The following code demonstrates the usage of the GDN’s streams feature by allowing users to send and receive messages in real-time. By leveraging the Python SDK, the code connects to the GDN by using one of the available methods, determines the appropriate stream prefix, and creates a new stream if one does not already exist.

To send messages, a producer is created, which accepts user-generated text input and publishes it to the stream. On the receiving end, a subscriber is set up to listen for incoming messages, decode them, and display the content to the user. The subscriber then acknowledges receipt of the message by sending a JSON object containing the message ID.

The code provides an interactive experience, enabling users to choose between writing data, reading data, or quitting the program. The demonstrated communication system serves as a foundation for more sophisticated stream-based applications that require real-time data exchange.

For this case, an API key is the chosen authentication method. The focus will be on using the code to write data to the stream named `c8globals.streamQuickstart` and reading the messages by opening that stream in the UI. When the user enters ‘0’ (zero) as a message, the program execution will automatically finish.

## Code

```py
# See SampleStream.py for the code
```

## Input Data

Only user-generated text messages are used as input data. Users can send and receive these messages via the stream by choosing between the options 'w' (write data) and 'r' (read data).

## Detailed Explanation

The code demonstrates stream-based data communication by sending and receiving messages through a stream. It first imports the necessary libraries, sets up connection parameters, and establishes a connection to a stream.

As stated above, the focus here is sending or writing data. 

1. **Connecting to GDN**: The code initializes the C8Client with the given URL, geofabric, API key, protocol, and port.
2. **Prefix determination**: Depending on the value of the **`is_local`** variable, the script sets the appropriate prefix for the stream. Possible values are `c8globals.` and `c8locals.`.
3. **Creating a stream**: The **`createStream()`** function checks if a stream with the given name already exists. If not, it creates one.
4. **Sending data**: The **`sendData()`** function creates a producer using the C8Client library and sends user-generated messages through the stream. The user can input a message, and the producer sends it to the stream. The loop continues until the user enters '0' (zero).
5. **Receiving data**: The **`receiveData()`** function creates a subscriber using the C8Client library and subscribes to the stream with a specified subscription name. The subscriber listens for incoming messages, decodes the received message, and prints it to the console. The function then acknowledges the received message by sending a JSON object containing the message ID.
6. **User interaction**: The script prompts the user to choose between writing data ('w'), reading data ('r'), or quitting ('0'). Based on the user's input, the script either sends data, receives data, or exits the program.

The script demonstrates how to create a simple stream-based data communication system using Python and the C8Client library. Users can send and receive messages through the stream in real-time, providing a foundation for more complex stream-based applications.

The easiest way to test this sample is to execute the program, enter write mode, open the stream in the UI, and write data. The same data will be displayed in the UI. Write ‘0’ to end the program.

This is a simple way to confirm that a stream is working as designed and expected.

Bear in mind that the API key has to be changed from `xxxx` to the value the platform gives the user while creating an API key. Also, the key permissions for the stream must be read/write.