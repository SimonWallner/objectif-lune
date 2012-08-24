#include <objectif-lune/objectifLune.hpp>

#include <iostream>

#include "serverHandler.hpp"

using namespace objectifLune;

Server::Server(unsigned short _portNumber)
	: portNumber(_portNumber)
{}


void Server::startService()
{
	serverHandler = new objectifLune::ServerHandler();
	boost::thread serviceThread(&Server::startupThread, this);
}

void Server::waitForConnections(unsigned int timeout) const
{
//	if (
	boost::this_thread::sleep(boost::posix_time::milliseconds(timeout));
}

void Server::startupThread()
{
	try
	{
		websocketpp::server::handler::ptr handle(serverHandler);
		websocketpp::server endpoint(handle);
		
		std::cout << "Starting Objectif Lune server on port " << portNumber << std::endl;
        endpoint.listen(portNumber);
	}
	catch (std::exception &e)
	{
		std::cerr << "Exception: " << e.what() << std::endl;
	}
}

void Server::sendLogMessage(std::string logLevel, std::string msg) const
{
	std::stringstream sstr;
	sstr << "{\"type\": \"log\", \"payload\": {\"level\": \""
		 << logLevel
		 << "\", \"message\": \""
		 << msg
		 << "\"}}";
	
	serverHandler->broadcast(sstr.str());
}

void Server::trace(std::string msg) const
{
	sendLogMessage("trace", msg);
}

void Server::debug(std::string msg) const
{
	sendLogMessage("debug", msg);
}

void Server::info(std::string msg) const
{
	sendLogMessage("info", msg);
}

void Server::warn(std::string msg) const
{
	sendLogMessage("warn", msg);
}

void Server::error(std::string msg) const
{
	sendLogMessage("error", msg);
}

void Server::fatal(std::string msg) const
{
	sendLogMessage("fatal", msg);
}

void Server::scalar(std::string name, float value) const
{
	std::stringstream sstr;
	sstr << "{\"type\": \"scalar\", \"payload\": {\"name\": ";
	sstr << "\"" << name << "\"";
	sstr << ", \"value\": ";
	sstr << value;
	sstr << "}}";
	
	serverHandler->broadcast(sstr.str());
}

void Server::data(float reference, std::string name, float value) const
{
	std::stringstream sstr;
	sstr << "{\"type\": \"data\", \"payload\": {\"name\": ";
	sstr << "\"" << name << "\"";
	sstr << ", \"reference\": ";
	sstr << reference;
	sstr << ", \"value\": ";
	sstr << value;
	sstr << "}}";

	serverHandler->broadcast(sstr.str());
}