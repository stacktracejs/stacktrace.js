#!/usr/bin/env python

# Usage: ./lcov-to-cobertura-xml.py lcov-file.dat output/cobertura.xml

import re, sys, os, time
from xml.dom import minidom
from optparse import OptionParser

# Given a FILE lcov-file return appropriate data structure
def parse_lcov_file(lcov_path, options):
	'''Given a path to a file in lcov format, return a data structure 
	representing it that can be serialized in any logical format.'''
	
	if (os.path.isfile(lcov_path)):
		coverage_data = {'packages': {}, 'summary': {'lines-total': 0, 'lines-covered': 0}}
		current_package = None
		current_package_lines_total = 0
		current_package_lines_covered = 0
		current_file = None
		current_file_lines_total = 0
		current_file_lines_covered = 0
		current_file_lines = {}
		lcov_file = open(lcov_path, 'r')
		
		for line in lcov_file:
			if line.strip() == 'end_of_record':
				if current_file is not None:
					current_package_dict = coverage_data['packages'][current_package]
					current_package_dict['lines-total'] += current_package_lines_total
					current_package_dict['lines-covered'] += current_package_lines_covered
					current_file_dict = current_package_dict['classes'][current_file]
					current_file_dict['lines-total'] = current_file_lines_total
					current_file_dict['lines-covered'] = current_file_lines_covered
					current_file_dict['lines'] = current_file_lines
					coverage_data['summary']['lines-total'] += current_file_lines_total
					coverage_data['summary']['lines-covered'] += current_file_lines_covered
				pass
			
			line_parts = line.split(':')
			input_type = line_parts[0]
			
			if input_type == 'SF':
				# Get file name
				file_name = line_parts[-1].strip()
				relative_file_name = os.path.relpath(file_name, options.base_dir)
				package = '.'.join(relative_file_name.split(os.path.sep)[0:-1])
				class_name = file_name.split(os.path.sep)[-1]
				# TODO: exclude test files here
				if package not in coverage_data['packages']:
					coverage_data['packages'][package] = {'classes': {}, 'lines-total': 0, 'lines-covered': 0}
				coverage_data['packages'][package]['classes'][relative_file_name] = {'name': class_name, 'lines': {}, 'lines-total': 0, 'lines-covered': 0}
				current_package = package
				current_file = relative_file_name
				current_file_lines.clear()
				current_file_lines_total = 0
				current_file_lines_covered = 0
				current_package_lines_total = 0
				current_package_lines_covered = 0
				
			elif input_type == 'DA':
				line_coverage = line_parts[-1].strip().split(',')
				current_file_lines[line_coverage[0]] = line_coverage[1]
				
				# Increment lines total/covered for class and package
				if int(line_coverage[1]) > 0:
					current_package_lines_covered += 1
					current_file_lines_covered += 1
				current_package_lines_total += 1
				current_file_lines_total += 1
		
		for package_name, package_data in coverage_data['packages'].items():
			package_data['line-rate'] = compute_line_rate(package_data['lines-total'], package_data['lines-covered'])
		
		lcov_file.close()
		
		return coverage_data
	else:
		raise '%s cannot be read' % lcov_path

def compute_line_rate(lines_total, lines_covered):
	if lines_total == 0:
		return '0.0'
	return str(float(float(lines_covered) / float(lines_total)))

# Generate cobertura XML
def generate_cobertura_xml(coverage_data, options):
	'''Given a list of lines of lcov input, return a String cobertura XML
	representation'''
	
	dom_impl = minidom.getDOMImplementation()
	doctype = dom_impl.createDocumentType("coverage", None, "http://cobertura.sourceforge.net/xml/coverage-03.dtd")
	document = dom_impl.createDocument(None, "coverage", doctype)
	root = document.documentElement
	
	summary = coverage_data['summary']
	
	root.setAttribute('branch-rate', '0')
	root.setAttribute('branches-covered', '0')
	root.setAttribute('branches-valid', '0')
	root.setAttribute('complexity', '0')
	root.setAttribute('line-rate', compute_line_rate(summary['lines-total'], summary['lines-covered']))
	root.setAttribute('lines-valid', str(summary['lines-total']))
	root.setAttribute('timestamp', str(int(time.time())))
	root.setAttribute('version', '1.9')
	
	sources = document.createElement('sources')
	root.appendChild(sources)
	
	packages_element = document.createElement('packages')
	
	packages = coverage_data['packages']
	for package_name, package_data in packages.items():
		# TODO: make more robust
		if package_name in options.excludes:
			continue
		package_element = document.createElement('package')
		package_element.setAttribute('line-rate', package_data['line-rate'])
		package_element.setAttribute('name', package_name)
		classes_element = document.createElement('classes')
		for class_name, class_data in package_data['classes'].items():
			class_element = document.createElement('class')
			class_element.setAttribute('branch-rate', '0')
			class_element.setAttribute('complexity', '0')
			class_element.setAttribute('filename', class_name)
			class_element.setAttribute('line-rate', compute_line_rate(class_data['lines-total'], class_data['lines-covered']))
			class_element.setAttribute('name', class_data['name'])
			lines_element = document.createElement('lines')
			
			lines = class_data['lines'].keys()
			lines.sort()
			for line_number in lines:
				line_element = document.createElement('line')
				line_element.setAttribute('branch', '0')
				line_element.setAttribute('hits', str(class_data['lines'][line_number]))
				line_element.setAttribute('number', str(line_number))
				lines_element.appendChild(line_element)
				
			class_element.appendChild(lines_element)
			classes_element.appendChild(class_element)
			
		package_element.appendChild(classes_element)
		packages_element.appendChild(package_element)
	root.appendChild(packages_element)
	
	return document.toprettyxml()
	
def write_output(xml_output, output_path):
	output_file = open(output_path, 'w')
	print >>output_file, xml_output
	output_file.close()

if __name__ == '__main__':
	parser = OptionParser()
	parser.usage = 'lcov-to-cobertura-xml.py lcov-file.dat'
	parser.description = 'Converts JsTestDriver lcov output to cobertura-compatible XML'
	parser.add_option('-b', '--base-dir', help='Directory where source files are located', action='store', dest='base_dir', default='.')
	parser.add_option('-e', '--excludes', help='Comma-separated list of regexes of packages to exclude', action='append', dest='excludes', default=[])
	parser.add_option('-o', '--output', help='Path to store cobertura xml file', action='store', dest='output', default='coverage.xml')
	(options, args) = parser.parse_args(args=sys.argv)
	if len(args) != 2:
		print parser.usage
		sys.exit(1)
	coverage_data = parse_lcov_file(args[1], options)
	xml_output = generate_cobertura_xml(coverage_data, options)
	write_output(xml_output, options.output)